import ByteBuffer from 'bytebuffer';
import shajs from 'sha.js';
import { Coin, SDKCoin } from '../common';

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
  signature: InternalPrivKey;
  account_number: string;
  sequence: string;
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
export const getZeroFee: () => StdFee = () => ({
  amount: [],
  gas: '0'
});

// return a new zero fee object to sign
export const getZeroFeeInSig: () => StdFeeInSig = () => ({
  amount: [],
  gas: 0
});

export function encodeTx(
  msgs: StdMsg[],
  rawPubKey: string,
  rawSigDER: string,
  seq: number
): string {
  const stdSig: StdSignature = {
    pub_key: convertToInternalPubKey(rawPubKey, _TYPE.PubKeySecp256k1),
    signature: convertToInternalSig(rawSigDER, _TYPE.SignatureKeySecp256k1),
    account_number: '0',
    sequence: String(seq)
  };

  const stdTx: StdTx = {
    msg: msgs,
    signatures: [stdSig],
    fee: getZeroFee()
  };

  const jsonStr = JSON.stringify(number2StringInObject(stdTx));
  return ByteBuffer.btoa(jsonStr);
}

export function decodeObject(result: any): any {
  var decodedResult = Object.assign({}, result);
  if ('deposit' in decodedResult) {
    decodedResult.deposit.amount = String(Number(decodedResult.deposit.amount) / 100000);
  }
  if ('delegated_power' in decodedResult) {
    decodedResult.delegated_power.amount = String(
      Number(decodedResult.delegated_power.amount) / 100000
    );
  }
  if ('voting_power' in decodedResult) {
    decodedResult.voting_power.amount = String(Number(decodedResult.voting_power.amount) / 100000);
  }
  if ('amount' in decodedResult) {
    decodedResult.amount.amount = String(Number(decodedResult.amount.amount) / 100000);
  }
  if ('stake' in decodedResult) {
    decodedResult.stake.amount = String(Number(decodedResult.stake.amount) / 100000);
  }
  if ('total_report_stake' in decodedResult) {
    decodedResult.total_report_stake.amount = String(
      Number(decodedResult.total_report_stake.amount) / 100000
    );
  }
  if ('total_upvote_stake' in decodedResult) {
    decodedResult.total_upvote_stake.amount = String(
      Number(decodedResult.total_upvote_stake.amount) / 100000
    );
  }
  if ('total_reward' in decodedResult) {
    decodedResult.total_reward.amount = String(Number(decodedResult.total_reward.amount) / 100000);
  }
  if ('app_consumption' in decodedResult) {
    decodedResult.app_consumption.amount = String(
      Number(decodedResult.app_consumption.amount) / 100000
    );
  }
  if ('saving' in decodedResult) {
    decodedResult.saving.amount = String(Number(decodedResult.saving.amount) / 100000);
  }
  if ('transaction_capacity' in decodedResult) {
    decodedResult.transaction_capacity.amount = String(
      Number(decodedResult.transaction_capacity.amount) / 100000
    );
  }
  if ('original_income' in decodedResult) {
    decodedResult.original_income.amount = String(
      Number(decodedResult.original_income.amount) / 100000
    );
  }
  if ('friction_income' in decodedResult) {
    decodedResult.friction_income.amount = String(
      Number(decodedResult.friction_income.amount) / 100000
    );
  }
  if ('actual_reward' in decodedResult) {
    decodedResult.actual_reward.amount = String(
      Number(decodedResult.actual_reward.amount) / 100000
    );
  }
  if ('unclaim_reward' in decodedResult) {
    decodedResult.unclaim_reward.amount = String(
      Number(decodedResult.unclaim_reward.amount) / 100000
    );
  }
  if ('agree_vote' in decodedResult) {
    decodedResult.agree_vote.amount = String(Number(decodedResult.agree_vote.amount) / 100000);
  }
  if ('disagree_vote' in decodedResult) {
    decodedResult.disagree_vote.amount = String(
      Number(decodedResult.disagree_vote.amount) / 100000
    );
  }
  var keys = Object.keys(result);

  for (var index in keys) {
    var key = keys[index];
    if (
      (key === 'details' || key === 'frozen_money_list' || key === 'donation_list') &&
      result[key] instanceof Array
    ) {
      decodedResult[key] = [];
      result[key].forEach(element => {
        decodedResult[key].push(decodeObject(element));
      });
    }
  }
  return decodedResult;
}

export function encodeMsg(msg: any): any {
  var encodedMsg = Object.assign({}, msg);
  if ('new_reset_public_key' in msg) {
    encodedMsg.new_reset_public_key = convertToInternalPubKey(
      msg.new_reset_public_key,
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

export function encodeSignMsg(stdMsg: StdMsg[], chainId: string, seq: number): any {
  const fee = getZeroFee();
  const stdSignMsg: StdSignMsg = {
    account_number: '0',
    chain_id: chainId,
    fee: fee,
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

function sortObject(object) {
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

function number2StringInObject(object) {
  var resultObj = {},
    keys = Object.keys(object);

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
