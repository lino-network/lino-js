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
export interface BlockMeta {
}
export interface Data {
    txs: string[];
}
export declare class Rpc {
    private _nodeUrl;
    constructor(nodeUrl: string);
    abciQuery(path: string, key: string, opts?: {
        height: string;
        trusted: boolean;
    }): Promise<ResultABCIQuery>;
    broadcastTxCommit(tx: string): Promise<ResultBroadcastTxCommit>;
    block(height: number): Promise<ResultBlock>;
}
