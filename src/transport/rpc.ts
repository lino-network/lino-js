import fetch from 'cross-fetch';
import { JsonRpcResponse, isJsonRpcSuccess } from './jsonrpc2';

export interface ResultABCIQuery {
  response: ResponseQuery;
}

export interface ResponseQuery {
  code: number;
  log: string;
  info: string;
  index: number;
  key: string;
  value: any;
  proof: string;
  height: number;
}

export interface ResultBroadcastTxCommit {
  check_tx: any;
  deliver_tx: any;
  hash: any;
  height: number;
}

export interface ResultBlock {
  block: Block;
  block_meta: BlockMeta;
}

export interface Block {
  data: Data;
}

export interface BlockMeta {}

export interface Data {
  txs: string[];
}

const DefaultABCIQueryOptions = {
  height: '0',
  trusted: false
};

export class Rpc {
  private _nodeUrl: string;

  constructor(nodeUrl: string) {
    this._nodeUrl = nodeUrl;
  }

  abciQuery(path: string, key: string, opts = DefaultABCIQueryOptions): Promise<ResultABCIQuery> {
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
      .then(response => response.json())
      .then((data: JsonRpcResponse<ResultABCIQuery>) => {
        if ('result' in data) {
          return data.result as ResultABCIQuery;
        } else {
          throw data.error;
        }
      });
  }

  broadcastTxCommit(tx: string): Promise<ResultBroadcastTxCommit> {
    return fetch(this._nodeUrl, {
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'jsonrpc-client',
        method: 'broadcast_tx_commit',
        params: {
          tx: tx
        }
      }),
      method: 'POST',
      mode: 'cors'
    })
      .then(response => response.json())
      .then((data: JsonRpcResponse<ResultBroadcastTxCommit>) => {
        if (isJsonRpcSuccess(data)) {
          return data.result as ResultBroadcastTxCommit;
        } else {
          throw data.error;
        }
      });
  }

  block(height: number): Promise<ResultBlock> {
    return fetch(this._nodeUrl, {
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'jsonrpc-client',
        method: 'block',
        params: {
          height: height
        }
      }),
      method: 'POST',
      mode: 'cors'
    })
      .then(response => response.json())
      .then((data: JsonRpcResponse<ResultBlock>) => {
        if (isJsonRpcSuccess(data)) {
          return data.result as ResultBlock;
        } else {
          throw data.error;
        }
      });
  }
}
