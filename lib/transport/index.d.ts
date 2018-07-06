import { ResultBlock, ResultBroadcastTxCommit } from './rpc';
export interface ITransport {
    query<T = any>(key: string, storeName: string): Promise<T>;
    querySubspace<T = any>(subspace: string, storeName: string, getKeyBy: GetKeyBy): Promise<ResultKV<string, T>[]>;
    block(height: number): Promise<ResultBlock>;
    signBuildBroadcast(msg: any, msgType: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
}
export interface ITransportOptions {
    nodeUrl: string;
    chainId?: string;
}
export interface ResultKV<K, V> {
    key: K;
    value: V;
}
export declare class Transport implements ITransport {
    private _chainId;
    private _rpc;
    constructor(opt: ITransportOptions);
    query<T>(key: string, storeName: string): Promise<T>;
    querySubspace<V>(subspace: string, storeName: string, getKeyBy: GetKeyBy): Promise<ResultKV<string, V>[]>;
    block(height: number): Promise<ResultBlock>;
    signBuildBroadcast(msg: any, msgType: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
}
export declare enum BroadCastErrorEnum {
    CheckTx = 0,
    DeliverTx = 1
}
export declare enum GetKeyBy {
    GetSubstringAfterKeySeparator = 0,
    GetHexSubstringAfterKeySeparator = 1,
    GetSubstringAfterSubstore = 2
}
export declare class BroadcastError extends Error {
    readonly code: number;
    readonly type: BroadCastErrorEnum;
    constructor(type: BroadCastErrorEnum, log: string, code: number);
}
