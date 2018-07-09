import ByteBuffer from 'bytebuffer';
import { encode } from 'punycode';
import shajs from 'sha.js';
import { Coin, SDKCoin } from '../common';

// TODO: for int64, maybe we should do extra check in proper place, or use string
export interface StdFee {
  amount: SDKCoin[];
  gas: number;
}

export interface StdSignature {
  pub_key: InternalPubKey;
  signature: InternalPrivKey;
  account_number: number;
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
  account_numbers: number[];
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
  amount: [],
  gas: 0
});

export function encodeTx(
  stdMsg: StdMsg,
  rawPubKey: string,
  rawSigDER: string,
  seq: number
): string {
  const stdSig: StdSignature = {
    pub_key: convertToInternalPubKey(rawPubKey, _TYPE.PubKeySecp256k1),
    signature: convertToInternalSig(rawSigDER, _TYPE.SignatureKeySecp256k1),
    account_number: 0,
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

export function encodeMsg(msg: any): any {
  var encodedMsg = Object.assign({}, msg);
  if ('new_master_public_key' in msg) {
    encodedMsg.new_master_public_key = convertToInternalPubKey(
      msg.new_master_public_key,
      _TYPE.PubKeySecp256k1
    );
  }

  if ('new_post_public_key' in msg) {
    encodedMsg.new_post_public_key = convertToInternalPubKey(
      msg.new_post_public_key,
      _TYPE.PubKeySecp256k1
    );
  }

  if ('new_transaction_public_key' in msg) {
    encodedMsg.new_transaction_public_key = convertToInternalPubKey(
      msg.new_transaction_public_key,
      _TYPE.PubKeySecp256k1
    );
  }

  if ('validator_public_key' in msg) {
    encodedMsg.validator_public_key = convertToInternalPubKey(
      msg.validator_public_key,
      _TYPE.PubKeyEd25519
    );
  }

  if ('new_micropayment_public_key' in msg) {
    encodedMsg.new_micropayment_public_key = convertToInternalPubKey(
      msg.new_micropayment_public_key,
      _TYPE.PubKeySecp256k1
    );
  }

  if ('public_key' in msg) {
    encodedMsg.public_key = convertToInternalPubKey(msg.public_key, _TYPE.PubKeySecp256k1);
  }

  return encodedMsg;
}
export function encodeSignMsg(stdMsg: StdMsg, chainId: string, seq: number): any {
  const fee = getZeroFee();
  const stdSignMsg: StdSignMsg = {
    chain_id: chainId,
    account_numbers: [],
    sequences: [seq],
    fee_bytes: ByteBuffer.btoa(JSON.stringify(fee)),
    msg_bytes: ByteBuffer.btoa(JSON.stringify(stdMsg)),
    alt_bytes: null
  };

  const jsonStr = JSON.stringify(stdSignMsg);
  console.log('TX string: ', jsonStr);

  const signMsgHash = shajs('sha256')
    .update(jsonStr)
    .digest();
  return signMsgHash;
}

export function convertMsg(msg: any): any {
  var encodedMsg = Object.assign({}, msg);
  if ('new_master_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.new_master_public_key);
    encodedMsg.new_master_public_key = getByteArray(buffer);
  }

  if ('new_post_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.new_post_public_key);
    encodedMsg.new_post_public_key = getByteArray(buffer);
  }

  if ('new_transaction_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.new_transaction_public_key);
    encodedMsg.new_transaction_public_key = getByteArray(buffer);
  }

  if ('validator_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.validator_public_key);
    encodedMsg.validator_public_key = getByteArray(buffer);
  }

  if ('new_micropayment_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.new_micropayment_public_key);
    encodedMsg.new_micropayment_public_key = getByteArray(buffer);
  }

  return encodedMsg;
}

function getByteArray(buffer: ByteBuffer): number[] {
  let res: number[] = [];
  for (var i = 0; i < buffer.limit; ++i) {
    res.push(buffer.readUint8());
  }
  return res;
}

//decode std key to raw key, only support secp256k1 for now
export function decodePrivKey(privKeyHex: string): string {
  privKeyHex = privKeyHex.toUpperCase();
  if (privKeyHex.startsWith(_PREFIX.PrefixPrivKeySecp256k1)) {
    return privKeyHex.slice(_PREFIX.PrefixPrivKeySecp256k1.length);
  } else if (privKeyHex.startsWith(_PREFIX.PrefixPrivKeyEd25519)) {
    return privKeyHex.slice(_PREFIX.PrefixPrivKeyEd25519.length);
  }

  throw new Error(`Decode priv key failed: ${privKeyHex}\n`);
}

export function decodePubKey(pubKeyHex: string): string {
  pubKeyHex = pubKeyHex.toUpperCase();
  if (pubKeyHex.startsWith(_PREFIX.PrefixPubKeySecp256k1)) {
    return pubKeyHex.slice(_PREFIX.PrefixPubKeySecp256k1.length);
  } else if (pubKeyHex.startsWith(_PREFIX.PrefixPubKeyEd25519)) {
    return pubKeyHex.slice(_PREFIX.PrefixPubKeyEd25519.length);
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
export function convertToInternalPrivKey(rawPrivKey: string, type: string): InternalPrivKey {
  const res: InternalPrivKey = {
    type: type,
    value: ByteBuffer.fromHex(rawPrivKey).toString('base64')
  };
  return res;
}
// convert raw pub key to internal pub key format
export function convertToInternalPubKey(rawPubKey: string, type: string): InternalPubKey {
  const res: InternalPubKey = {
    type: type,
    value: ByteBuffer.fromHex(rawPubKey).toString('base64')
  };
  return res;
}
// convert raw sig to internal sig format
export function convertToInternalSig(rawSig: string, type: string): InternalSignature {
  const res: InternalSignature = {
    type: type,
    value: ByteBuffer.fromHex(rawSig).toString('base64')
  };
  return res;
}

// convert internal priv key to raw priv key
export function convertToRawPrivKey(internalPrivKey: InternalPrivKey): string {
  return ByteBuffer.fromBase64(internalPrivKey.value).toString('hex');
}
// convert internal pub key to raw pub key
export function convertToRawPubKey(internalPubKey: InternalPubKey): string {
  return ByteBuffer.fromBase64(internalPubKey.value).toString('hex');
}
// convert internal sig to raw sig
export function convertToRawSig(internalSignature: InternalSignature): string {
  return ByteBuffer.fromBase64(internalSignature.value).toString('hex');
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
