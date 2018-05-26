import { Coin } from '../query';
import shajs from 'sha.js';
import ByteBuffer from 'bytebuffer';

// TODO: for int64, maybe we should do extra check in proper place, or use string
export interface StdFee {
  Amount: number[];
  Gas: number;
}

export interface StdSignature {
  pub_key: IPubKey;
  signature: ISignature;
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

export interface IPubKey {
  type: string;
  value: string;
}

export interface ISignature {
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
  pubKeyHex: string,
  sigDERHex: string,
  seq: number
): string {
  const stdMsg: StdMsg = {
    type: msgType,
    value: msg
  };

  const stdSig: StdSignature = {
    pub_key: {
      type: _TYPE.PubKeySecp256k1,
      value: ByteBuffer.fromHex(pubKeyHex).toString('base64')
    },
    signature: {
      type: _TYPE.SignatureKeySecp256k1,
      value: ByteBuffer.fromHex(sigDERHex).toString('base64')
    },
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

const _TYPE = {
  PubKeyEd25519: 'AC26791624DE60',
  PubKeySecp256k1: 'F8CCEAEB5AE980',

  PrivKeyEd25519: '954568A3288910',
  PrivKeySecp256k1: '019E82E1B0F798',

  SignatureKeyEd25519: '6BF5903DA1DB28',
  SignatureKeySecp256k1: '6D1EA416E1FEE8'
};
