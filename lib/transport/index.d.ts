import { ResultBlock, ResultBroadcastTxCommit } from './rpc';
export interface ITransport {
    query<T = any>(key: string, storeName: string): Promise<T>;
    querySubspace<T>(subspace: string, storeName: string): Promise<T[]>;
    block(height: number): Promise<ResultBlock>;
    signBuildBroadcast(msg: any, msgType: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
}
export interface ITransportOptions {
    nodeUrl: string;
    chainId?: string;
}
export declare class Transport implements ITransport {
    private _chainId;
    private _rpc;
    constructor(opt: ITransportOptions);
    query<T>(key: string, storeName: string): Promise<T>;
    querySubspace<T>(subspace: string, storeName: string): Promise<T[]>;
    block(height: number): Promise<ResultBlock>;
    signBuildBroadcast(msg: any, msgType: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
}
export declare enum BroadCastErrorEnum {
    CheckTx = 0,
    DeliverTx = 1
}
export declare class BroadcastError extends Error {
    readonly code: number;
    readonly type: BroadCastErrorEnum;
    constructor(type: BroadCastErrorEnum, log: string, code: number);
}
