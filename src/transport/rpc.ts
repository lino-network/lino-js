import * as JsonRpc2 from './jsonrpc2';
const fetch = require('cross-fetch');

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
    key: ByteBuffer,
    opts = DefaultABCIQueryOptions
  ): Promise<IResponseQuery> {
    return fetch(this._nodeUrl, {
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'jsonrpc-client',
        method: 'abci_query',
        params: {
          ...opts,
          path,
          data: key.toArrayBuffer()
        }
      }),
      method: 'POST',
      mode: 'cors'
    })
      .then((response: Response) => response.json())
      .then(
        (
          data:
            | JsonRpc2.JsonRpcSuccess<IResponseQuery>
            | JsonRpc2.JsonRpcFailure<IResponseQuery>
        ) => {
          if ('result' in data) {
            return data.result as IResponseQuery;
          } else {
            throw data.error;
          }
        }
      );
  }
}
