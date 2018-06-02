import { ResultBroadcastTxCommit, ResultBlock } from './rpc';
export interface ITransport {
    query<T = any>(key: string, storeName: string): Promise<T>;
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
    block(height: number): Promise<ResultBlock>;
    signBuildBroadcast(msg: any, msgType: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
}
