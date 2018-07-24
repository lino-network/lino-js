import ByteBuffer from 'bytebuffer';
import { ec as EC } from 'elliptic';
import {
  decodePrivKey,
  encodeSignMsg,
  encodeTx,
  convertMsg,
  StdMsg,
  encodeMsg,
  decodeObject
} from './encoder';
import { ResultBlock, ResultBroadcastTxCommit, Rpc } from './rpc';
import Keys from '../query/keys';

export interface ITransport {
  query<T = any>(key: string, storeName: string): Promise<T>;
  querySubspace<T = any>(
    subspace: string,
    storeName: string,
    getKeyBy: GetKeyBy
  ): Promise<ResultKV<string, T>[]>;
  block(height: number): Promise<ResultBlock>;
  signBuildBroadcast(
    msg: any,
    msgType: string,
    privKeyHex: string,
    seq: number
  ): Promise<ResultBroadcastTxCommit>;
}

export interface ITransportOptions {
  nodeUrl: string;
  chainId?: string;
}

export interface ResultKV<K, V> {
  key: K;
  value: V;
}

export class Transport implements ITransport {
  // This will be hard coded later
  private _chainId: string;
  private _rpc: Rpc;

  constructor(opt: ITransportOptions) {
    this._rpc = new Rpc(opt.nodeUrl); // create with nodeUrl
    this._chainId = opt.chainId || 'test-chain-z0QKeL';
  }

  query<T>(key: string, storeName: string): Promise<T> {
    // transport: get path and key for ABCIQuery and return result
    // get transport's node and do ABCIQuery
    // rpc client do rpc call
    // check resp
    const path = `/store/${storeName}/key`;
    return this._rpc.abciQuery(path, key).then(result => {
      if (!result.response || !result.response.value) {
        throw new Error('Query failed: Empty result');
      }

      const jsonStr = ByteBuffer.atob(result.response.value);
      return decodeObject(JSON.parse(jsonStr) as T);
    });
  }

  querySubspace<V>(
    subspace: string,
    storeName: string,
    getKeyBy: GetKeyBy
  ): Promise<ResultKV<string, V>[]> {
    // transport: get path and key for ABCIQuery and return result
    // get transport's node and do ABCIQuery
    // rpc client do rpc call
    // check resp
    const path = `/store/${storeName}/subspace-js`;
    return this._rpc.abciQuery(path, subspace).then(result => {
      if (!result.response || !result.response.value) {
        throw new Error('QuerySubspace failed: Empty result');
      }

      const resValStr = ByteBuffer.atob(result.response.value);
      let resKVs = JSON.parse(resValStr);
      let rst: ResultKV<string, V>[] = [];
      if (resKVs === null) {
        return rst;
      }
      for (let i = 0; i < resKVs.length; i++) {
        const rawKey = ByteBuffer.atob(resKVs[i].key);
        let keyStr: string = '';
        switch (getKeyBy) {
          case GetKeyBy.GetHexSubstringAfterKeySeparator: {
            keyStr = Keys.getHexSubstringAfterKeySeparator(rawKey);
            break;
          }
          case GetKeyBy.GetSubstringAfterKeySeparator: {
            keyStr = Keys.getSubstringAfterKeySeparator(rawKey);
            break;
          }
          default: {
            keyStr = rawKey;
          }
        }
        const jsonValueStr = ByteBuffer.atob(resKVs[i].value);
        let value = JSON.parse(jsonValueStr) as V;
        let item: ResultKV<string, V> = { key: keyStr, value: decodeObject(value) };
        rst.push(item);
      }

      return rst;
    });
  }

  block(height: number): Promise<ResultBlock> {
    return this._rpc.block(height).then(result => {
      return result as ResultBlock;
    });
  }

  // Does the private key decoding from hex, sign message,
  // build transaction to broadcast
  signBuildBroadcast(
    msg: any,
    msgType: string,
    privKeyHex: string,
    seq: number
  ): Promise<ResultBroadcastTxCommit> {
    // private key from hex
    var ec = new EC('secp256k1');
    var key = ec.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');

    // XXX: side effect on msg
    convertMsg(msg);
    const stdMsg: StdMsg = {
      type: msgType,
      value: encodeMsg(msg)
    };

    // signmsg
    var msgs = new Array<StdMsg>(stdMsg);
    const signMsgHash = encodeSignMsg(msgs, this._chainId, seq);
    // sign to get signature
    const sig = key.sign(signMsgHash, { canonical: true });
    const sigDERHex = sig.toDER('hex');
    // build tx
    const tx = encodeTx(msgs, key.getPublic(true, 'hex'), sigDERHex, seq);

    // return broadcast
    return this._rpc.broadcastTxCommit(tx).then(result => {
      if (result.check_tx.code !== undefined) {
        throw new BroadcastError(
          BroadCastErrorEnum.CheckTx,
          result.check_tx.log,
          result.check_tx.code
        );
      } else if (result.deliver_tx.code !== undefined) {
        throw new BroadcastError(
          BroadCastErrorEnum.DeliverTx,
          result.deliver_tx.log,
          result.deliver_tx.code
        );
      }
      return result;
    });
  }
}

export enum BroadCastErrorEnum {
  CheckTx,
  DeliverTx
}

export enum GetKeyBy {
  GetSubstringAfterKeySeparator,
  GetHexSubstringAfterKeySeparator,
  GetSubstringAfterSubstore
}

// How to extend Error in TS2.1+:
// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
export class BroadcastError extends Error {
  readonly code: number;
  readonly type: BroadCastErrorEnum;

  constructor(type: BroadCastErrorEnum, log: string, code: number) {
    super(log);
    Object.setPrototypeOf(this, BroadcastError.prototype);
    this.type = type;
    this.code = code;
  }
}
