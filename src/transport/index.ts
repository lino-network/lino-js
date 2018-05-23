//@ts-ignore
import * as ByteBuffer from 'bytebuffer';
import { Rpc, ResultBroadcastTxCommit } from './rpc';
import { encodeSignMsg, encodeTx } from './utils';

export interface ITransport {
  query<T = any>(key: string, storeName: string): Promise<T | null>;
  signBuildBroadcast(
    msg: any,
    privKeyHex: string,
    seq: number
  ): Promise<ResultBroadcastTxCommit>;
}

export interface ITransportOptions {
  nodeUrl: string;
}

export class Transport implements ITransport {
  // This will be hard coded later
  private _chainId = 'test-chain-jrTild';
  private _rpc: Rpc;
  private _cdc = null;

  constructor(opt: ITransportOptions) {
    this._rpc = new Rpc(opt.nodeUrl); // create with nodeUrl
  }

  query<T>(key: string, storeName: string): Promise<T | null> {
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

      const jsonStr = atob(result.response.value);
      const obj = JSON.parse(jsonStr);
      return obj as T;
    });
  }

  // Does the private key decoding from hex, sign message,
  // build transaction to broadcast
  signBuildBroadcast(
    msg: any,
    privKeyHex: string,
    seq: number
  ): Promise<ResultBroadcastTxCommit> {
    // private key from hex

    // signmsg
    const signMsg = encodeSignMsg(msg, this._chainId, seq);
    // sign to get signature
    // build tx
    const tx = encodeTx(
      msg,
      '7Qo5AtmHEOufOenbfKlaMFEA9AHSXI4wwOSZEqVWjP0=',
      'UxcSvGiVvNk4fG3aCSdX7v+xrQ3PZtDv9ohDVeRJCcBnyIyRw1I1jsIgVboJDWSP5cF21e1RQpDLEr+veftcDQ==',
      0
    );
    // return broadcast
    return this._rpc.broadcastTxCommit(tx).then(result => {
      return result;
    });
  }
}
