import { Coin } from '../common';
import shajs from 'sha.js';
import ByteBuffer from 'bytebuffer';

// TODO: for int64, maybe we should do extra check in proper place, or use string
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

// return a new zero fee object
export const getZeroFee: () => StdFee = () => ({
  Amount: [],
  Gas: 0
});

export function encodeTx(
  msg: any,
  msgType: string,
  rawPubKey: string,
  rawSigDER: string,
  seq: number
): string {
  const stdMsg: StdMsg = {
    type: msgType,
    value: msg
  };

  const stdSig: StdSignature = {
    pub_key: convertToInternalPubKey(rawPubKey),
    signature: convertToInternalSig(rawSigDER),
    sequence: seq
  };

  const stdTx: StdTx = {
    msg: stdMsg,
    signatures: [stdSig],
    fee: getZeroFee()
  };
  const jsonStr = JSON.stringify(stdTx);
  return ByteBuffer.btoa(jsonStr);
}

export function encodeSignMsg(msg: any, chainId: string, seq: number): any {
  const fee = getZeroFee();
  const stdSignMsg: StdSignMsg = {
    chain_id: chainId,
    sequences: [seq],
    fee_bytes: ByteBuffer.btoa(JSON.stringify(fee)),
    msg_bytes: ByteBuffer.btoa(JSON.stringify(msg)),
    alt_bytes: null
  };

  const jsonStr = JSON.stringify(stdSignMsg);
  const signMsgHash = shajs('sha256')
    .update(jsonStr)
    .digest();
  return signMsgHash;
}

//decode std key to raw key, only support secp256k1 for now
export function decodePrivKey(privKeyHex: string): string {
  privKeyHex = privKeyHex.toUpperCase();
  if (privKeyHex.startsWith(_PREFIX.PrefixPrivKeySecp256k1)) {
    return privKeyHex.slice(_PREFIX.PrefixPrivKeySecp256k1.length);
  }

  throw new Error(`Decode priv key failed: ${privKeyHex}\n`);
}

export function decodePubKey(pubKeyHex: string): string {
  pubKeyHex = pubKeyHex.toUpperCase();
  if (pubKeyHex.startsWith(_PREFIX.PrefixPubKeySecp256k1)) {
    return pubKeyHex.slice(_PREFIX.PrefixPubKeySecp256k1.length);
  }

  throw new Error(`Decode pub key failed: ${pubKeyHex}\n`);
}

//eoncde raw key to std key, only support secp256k1 for now
export function encodePrivKey(privKeyHex: string): string {
  return _PREFIX.PrefixPrivKeySecp256k1.concat(privKeyHex).toUpperCase();
}

export function encodePubKey(pubKeyHex: string): string {
  return _PREFIX.PrefixPubKeySecp256k1.concat(pubKeyHex).toUpperCase();
}

// convert raw priv key to internal priv key format
export function convertToInternalPrivKey(rawPrivKey: string): InternalPrivKey {
  const res: InternalPrivKey = {
    type: _TYPE.PrivKeySecp256k1,
    value: ByteBuffer.fromHex(rawPrivKey).toString('base64')
  };
  return res;
}
// convert raw pub key to internal pub key format
export function convertToInternalPubKey(rawPubKey: string): InternalPubKey {
  const res: InternalPubKey = {
    type: _TYPE.PubKeySecp256k1,
    value: ByteBuffer.fromHex(rawPubKey).toString('base64')
  };
  return res;
}
// convert raw sig to internal sig format
export function convertToInternalSig(rawSig: string): InternalSignature {
  const res: InternalSignature = {
    type: _TYPE.SignatureKeySecp256k1,
    value: ByteBuffer.fromHex(rawSig).toString('base64')
  };
  return res;
}

// convert internal priv key to raw priv key
export function convertToRawPrivKey(internalPrivKey: InternalPrivKey): string {
  return internalPrivKey.value;
}
// convert internal pub key to raw pub key
export function convertToRawPubKey(internalPubKey: InternalPubKey): string {
  return internalPubKey.value;
}
// convert internal sig to raw sig
export function convertToRawSig(internalSignature: InternalSignature): string {
  return internalSignature.value;
}

const _TYPE = {
  PubKeyEd25519: 'AC26791624DE60',
  PubKeySecp256k1: 'F8CCEAEB5AE980',

  PrivKeyEd25519: '954568A3288910',
  PrivKeySecp256k1: '019E82E1B0F798',

  SignatureKeyEd25519: '6BF5903DA1DB28',
  SignatureKeySecp256k1: '6D1EA416E1FEE8'
};

const _PREFIX = {
  PrefixPubKeyEd25519: '1624DE6220',
  PrefixPubKeySecp256k1: 'EB5AE98221',

  PrefixPrivKeyEd25519: 'A328891240',
  PrefixPrivKeySecp256k1: 'E1B0F79A20'
};
