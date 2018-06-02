import ByteBuffer from 'bytebuffer';
import { Rpc, ResultBroadcastTxCommit, ResultBlock } from './rpc';
import { encodeSignMsg, encodeTx, decodePrivKey } from './encoder';
import { ec as EC } from 'elliptic';

export interface ITransport {
  query<T = any>(key: string, storeName: string): Promise<T>;
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

export class Transport implements ITransport {
  // This will be hard coded later
  private _chainId: string;
  private _rpc: Rpc;

  constructor(opt: ITransportOptions) {
    this._rpc = new Rpc(opt.nodeUrl); // create with nodeUrl
    this._chainId = opt.chainId || 'test-chain-rlmPwO';
  }

  query<T>(key: string, storeName: string): Promise<T> {
    // transport: get path and key for ABCIQuery and return result
    // get transport's node and do ABCIQuery
    // rpc client do rpc call
    // check resp
    const path = `/${storeName}/key`;
    return this._rpc.abciQuery(path, key).then(result => {
      if (result.response == null) {
        throw new Error(`Empty response\n`);
      }
      if (result.response.value == null) {
        throw new Error(
          `Query failed: ${result.response.code}\n${result.response.log}`
        );
      }

      const jsonStr = ByteBuffer.atob(result.response.value);
      return JSON.parse(jsonStr) as T;
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
    // signmsg
    const signMsgHash = encodeSignMsg(msg, this._chainId, seq);
    // sign to get signature
    const sig = key.sign(signMsgHash, { canonical: true });
    const sigDERHex = sig.toDER('hex');
    // build tx
    const tx = encodeTx(
      msg,
      msgType,
      key.getPublic(true, 'hex'),
      sigDERHex,
      seq
    );

    // return broadcast
    return this._rpc.broadcastTxCommit(tx).then(result => {
      return result as ResultBroadcastTxCommit;
    });
  }
}
