import ByteBuffer from 'bytebuffer';
import shajs from 'sha.js';
import { Coin, SDKCoin } from '../common';
import bech32 from 'bech32';

// TODO: for int64, maybe we should do extra check in proper place, or use string
export interface StdFee {
  amount: SDKCoin[];
  gas: string;
}

export interface StdFeeInSig {
  amount: SDKCoin[];
  gas: number;
}

export interface StdSignature {
  pub_key: InternalPubKey;
  signature: InternalSignature;
}

export interface StdMsg {
  type: string;
  value: string;
}

export interface StdTx {
  msg: StdMsg[];
  fee: StdFee;
  signatures: StdSignature[];
}

export interface StdSignMsg {
  chain_id: string;
  account_number: string;
  sequence: string;
  fee: StdFee;
  msgs: StdMsg[];
  memo: string;
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
export const getFee: (maxFeeInCoin: number) => StdFee = maxFeeInCoin => ({
  amount: [{ denom: 'linocoin', amount: maxFeeInCoin }],
  gas: '0'
});

// return a new zero fee object to sign
export const getZeroFeeInSig: () => StdFeeInSig = () => ({
  amount: [],
  gas: 0
});

export function encodeTx(
  msgs: StdMsg[],
  rawPubKey: string[],
  rawSigDER: string[],
  maxFeeInCoin: number
): string {
  var sigs: StdSignature[] = [];
  for (var _i = 0; _i < rawPubKey.length; _i++) {
    const stdSig: StdSignature = {
      pub_key: convertToInternalPubKey(rawPubKey[_i], _TYPE.PubKeySecp256k1),
      signature: ByteBuffer.fromHex(rawSigDER[_i]).toString('base64')
    };
    sigs.push(stdSig);
  }

  const stdTx: StdTx = {
    msg: msgs,
    signatures: sigs,
    fee: getFee(maxFeeInCoin)
  };

  const authStdTx: StdMsg = {
    type: 'auth/StdTx',
    value: number2StringInObject(stdTx)
  };
  const jsonStr = JSON.stringify(authStdTx);
  return ByteBuffer.btoa(jsonStr);
}

export function decodeObject(result: any): any {
  var decodedResult = Object.assign({}, result);
  var keys = Object.keys(result);
  if (keys.length === 1 && keys[0] === 'amount' && !isNaN(decodedResult.amount)) {
    decodedResult.amount = String(Number(decodedResult.amount) / 100000);
    return decodedResult;
  }
  if (typeof result === 'string') {
    return String(result);
  }
  if (result instanceof Array) {
    decodedResult = [];
    result.forEach(element => {
      decodedResult.push(decodeObject(element));
    });
  } else {
    for (var index in keys) {
      var key = keys[index];
      if (key === 'memo' || key === 'title' || key === 'content' || key === 'description') {
        if (decodedResult[key] !== null) {
          decodedResult[key] = decodeURIComponent(escape(result[key]));
        }
      }
      if (
        decodedResult[key] !== null &&
        typeof decodedResult[key] !== 'string' &&
        typeof decodedResult[key] !== 'boolean' &&
        typeof decodedResult[key] !== 'number'
      ) {
        decodedResult[key] = decodeObject(result[key]);
      }
      if (key === 'address' && result[key].startsWith('lino')) {
        var decodeRes = bech32.decode(result[key]);
        if (decodeRes.prefix !== 'lino') {
          throw new Error(`invalid prefix: ${decodeRes.prefix}\n`);
        }
        decodedResult[key] = encodeToHex(bech32.fromWords(decodeRes.words));
      }
    }
  }
  return decodedResult;
}

export function encodeObject(result: any): any {
  var encodeResult = Object.assign({}, result);
  var keys = Object.keys(result);
  if (keys.length === 1 && keys[0] === 'amount' && !isNaN(encodeResult.amount)) {
    encodeResult.amount = String(Number(encodeResult.amount) * 100000);
    return encodeResult;
  }
  if (typeof result === 'string') {
    return String(result);
  }
  if (result instanceof Array) {
    encodeResult = [];
    result.forEach(element => {
      encodeResult.push(encodeObject(element));
    });
  } else {
    for (var index in keys) {
      var key = keys[index];
      if (
        encodeResult[key] !== null &&
        typeof encodeResult[key] !== 'string' &&
        typeof encodeResult[key] !== 'boolean'
      ) {
        encodeResult[key] = encodeObject(result[key]);
      }
    }
  }
  return encodeResult;
}

export function encodeMsg(msg: any): any {
  var encodedMsg = Object.assign({}, msg);
  if ('new_reset_public_key' in msg) {
    encodedMsg.new_reset_public_key = convertToInternalPubKey(
      msg.new_reset_public_key,
      _TYPE.PubKeySecp256k1
    );
  }

  if ('new_transaction_public_key' in msg) {
    encodedMsg.new_transaction_public_key = convertToInternalPubKey(
      msg.new_transaction_public_key,
      _TYPE.PubKeySecp256k1
    );
  }

  if ('new_app_public_key' in msg) {
    encodedMsg.new_app_public_key = convertToInternalPubKey(
      msg.new_app_public_key,
      _TYPE.PubKeySecp256k1
    );
  }

  if ('validator_public_key' in msg) {
    encodedMsg.validator_public_key = convertToInternalPubKey(
      msg.validator_public_key,
      _TYPE.PubKeyEd25519
    );
  }

  if ('public_key' in msg) {
    encodedMsg.public_key = convertToInternalPubKey(msg.public_key, _TYPE.PubKeySecp256k1);
  }

  return encodedMsg;
}

export function encodeSignMsg(
  stdMsg: StdMsg[],
  chainId: string,
  seq: number,
  maxFeeInCoin: number
): any {
  const stdSignMsg: StdSignMsg = {
    account_number: '0',
    chain_id: chainId,
    fee: getFee(maxFeeInCoin),
    memo: '',
    msgs: stdMsg,
    sequence: String(seq)
  };

  const jsonStr = JSON.stringify(number2StringInObject(sortObject(stdSignMsg)));

  const signMsgHash = shajs('sha256')
    .update(jsonStr)
    .digest();
  return signMsgHash;
}

export function convertMsg(msg: any): any {
  var encodedMsg = Object.assign({}, msg);
  if ('new_reset_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.new_reset_public_key);
    encodedMsg.new_reset_public_key = getByteArray(buffer);
  }

  if ('new_transaction_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.new_transaction_public_key);
    encodedMsg.new_transaction_public_key = getByteArray(buffer);
  }

  if ('new_app_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.new_app_public_key);
    encodedMsg.new_app_public_key = getByteArray(buffer);
  }

  if ('validator_public_key' in msg) {
    var buffer = ByteBuffer.fromHex(msg.validator_public_key);
    encodedMsg.validator_public_key = getByteArray(buffer);
  }

  return encodedMsg;
}

export function getByteArray(buffer: ByteBuffer): number[] {
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

function sortObject(object) {
  if (typeof object == 'string') {
    return object;
  }
  var sortedObj = {},
    keys = Object.keys(object);

  keys.sort(function(key1, key2) {
    (key1 = key1.toLowerCase()), (key2 = key2.toLowerCase());
    if (key1 < key2) return -1;
    if (key1 > key2) return 1;
    return 0;
  });

  for (var index in keys) {
    var key = keys[index];
    if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
      sortedObj[key] = sortObject(object[key]);
    } else if (typeof object[key] == 'object' && object[key] instanceof Array) {
      sortedObj[key] = [];
      object[key].forEach(element => {
        sortedObj[key].push(sortObject(element));
      });
    } else {
      sortedObj[key] = object[key];
    }
  }
  return sortedObj;
}

function number2StringInObject(object): any {
  var resultObj = {},
    keys = Object.keys(object);

  if (typeof object == 'string') {
    return object;
  }
  for (var index in keys) {
    var key = keys[index];
    if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
      resultObj[key] = number2StringInObject(object[key]);
    } else if (typeof object[key] == 'object' && object[key] instanceof Array) {
      resultObj[key] = [];
      object[key].forEach(element => {
        resultObj[key].push(number2StringInObject(element));
      });
    } else {
      if (typeof object[key] == 'number') {
        resultObj[key] = String(object[key]);
      } else {
        resultObj[key] = object[key];
      }
    }
  }
  return resultObj;
}

function encodeToHex(arr: Array<number>): String {
  var res = '';
  for (var i = 0; i < arr.length; i++) res += arr[i].toString(16);
  return res.toUpperCase();
}

const _TYPE = {
  PubKeyEd25519: 'tendermint/PubKeyEd25519',
  PubKeySecp256k1: 'tendermint/PubKeySecp256k1',

  PrivKeyEd25519: 'tendermint/PrivKeyEd25519',
  PrivKeySecp256k1: 'tendermint/PrivKeySecp256k1',

  SignatureKeyEd25519: 'tendermint/SignatureEd25519',
  SignatureKeySecp256k1: 'tendermint/SignatureSecp256k1'
};

const _PREFIX = {
  PrefixPubKeyEd25519: '1624DE6420',
  PrefixPubKeySecp256k1: 'EB5AE98721',

  PrefixPrivKeyEd25519: 'A328891040',
  PrefixPrivKeySecp256k1: 'E1B0F79B20'
};
