export interface StdFee {
    Amount: number[];
    Gas: number;
}
export interface StdSignature {
    pub_key: InternalPubKey;
    signature: InternalPrivKey;
    sequence: number;
}
export interface StdMsg {
    type: string;
    value: string;
}
export interface StdTx {
    msg: StdMsg;
    fee: StdFee;
    signatures: StdSignature[];
}
export interface StdSignMsg {
    chain_id: string;
    sequences: number[];
    fee_bytes: string;
    msg_bytes: string;
    alt_bytes: any;
}
export interface InternalPubKey {
    type: string;
    value: string;
}
export interface InternalSignature {
    type: string;
    value: string;
}
export interface InternalPrivKey {
    type: string;
    value: string;
}
export declare const getZeroFee: () => StdFee;
export declare function encodeTx(msg: any, msgType: string, rawPubKey: string, rawSigDER: string, seq: number): string;
export declare function encodeMsg(msg: any): any;
export declare function encodeSignMsg(msg: any, chainId: string, seq: number): any;
export declare function convertMsg(msg: any): any;
export declare function decodePrivKey(privKeyHex: string): string;
export declare function decodePubKey(pubKeyHex: string): string;
export declare function encodePrivKey(privKeyHex: string): string;
export declare function encodePubKey(pubKeyHex: string): string;
export declare function convertToInternalPrivKey(rawPrivKey: string, type: string): InternalPrivKey;
export declare function convertToInternalPubKey(rawPubKey: string, type: string): InternalPubKey;
export declare function convertToInternalSig(rawSig: string, type: string): InternalSignature;
export declare function convertToRawPrivKey(internalPrivKey: InternalPrivKey): string;
export declare function convertToRawPubKey(internalPubKey: InternalPubKey): string;
export declare function convertToRawSig(internalSignature: InternalSignature): string;