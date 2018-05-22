//@ts-ignore
import ByteBuffer from 'bytebuffer';
import fetch from 'cross-fetch';
import * as JsonRpc2 from './jsonrpc2';

export interface IResultABCIQuery {
  response: IResponseQuery;
}

export interface IResponseQuery {
  code: number;
  log: string;
  info: string;
  index: number;
  key: string;
  value: any;
  proof: string;
  height: number;
}

const DefaultABCIQueryOptions = {
  height: 0,
  trusted: false
};

export class Rpc {
  private _nodeUrl: string;

  constructor(nodeUrl: string) {
    this._nodeUrl = nodeUrl;
  }

  abciQuery<T>(
    path: string,
    key: string,
    opts = DefaultABCIQueryOptions
  ): Promise<IResultABCIQuery> {
    return fetch(this._nodeUrl, {
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'jsonrpc-client',
        method: 'abci_query',
        params: {
          ...opts,
          path,
          data: key
        }
      }),
      method: 'POST',
      mode: 'cors'
    })
      .then((response: any) => response.json())
      .then(
        (
          data:
            | JsonRpc2.JsonRpcSuccess<IResultABCIQuery>
            | JsonRpc2.JsonRpcFailure<IResultABCIQuery>
        ) => {
          if ('result' in data) {
            return data.result as IResultABCIQuery;
          } else {
            throw data.error;
          }
        }
      );
  }
}
