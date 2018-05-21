//@ts-ignore
import * as ByteBuffer from 'bytebuffer';
import { Rpc } from './rpc';

export interface ITransport {
  query<T = any>(key: ByteBuffer, storeName: string): Promise<T | null>;
}

export interface ITransportOptions {
  nodeUrl: string;
}

export class Transport implements ITransport {
  // This will be hard coded later
  private _chainId = 'lino-0001';
  private _rpc: Rpc;
  private _cdc = null;

  constructor(opt: ITransportOptions) {
    this._rpc = new Rpc(opt.nodeUrl); // create with nodeUrl
  }

  query<T>(key: ByteBuffer, path: string): Promise<T | null> {
    // transport: get path and key for ABCIQuery and return result
    // get transport's node and do ABCIQuery
    // rpc client do rpc call
    // check resp
    return this._rpc.abciQuery<T>(path, key).then(result => {
      if (result.code !== 0) {
        throw new Error(`Query failed: ${result.code}\n${result.log}`);
      }
      if (result.value === null) {
        throw new Error(`Empty response\n${result.log}`);
      }
      return result.value as T;
    });
  }
}
