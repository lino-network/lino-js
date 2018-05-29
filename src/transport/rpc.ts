//@ts-ignore
import ByteBuffer from 'bytebuffer';
import fetch from 'cross-fetch';
import * as JsonRpc2 from './jsonrpc2';
import { StdTx } from './utils';

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
  height: 0,
  trusted: false
};

export class Rpc {
  private _nodeUrl: string;

  constructor(nodeUrl: string) {
    this._nodeUrl = nodeUrl;
  }

  abciQuery(
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
      .then((response: any) => response.json())
      .then(
        (
          data:
            | JsonRpc2.JsonRpcSuccess<ResultBroadcastTxCommit>
            | JsonRpc2.JsonRpcFailure<ResultBroadcastTxCommit>
        ) => {
          if ('result' in data) {
            return data.result as ResultBroadcastTxCommit;
          } else {
            throw data.error;
          }
        }
      );
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
      .then((response: any) => response.json())
      .then(
        (
          data:
            | JsonRpc2.JsonRpcSuccess<ResultBlock>
            | JsonRpc2.JsonRpcFailure<ResultBlock>
        ) => {
          if ('result' in data) {
            return data.result as ResultBlock;
          } else {
            throw data.error;
          }
        }
      );
  }
}
