import elliptic from 'elliptic';
import { Coin } from '../query';

// TODO: for int64, maybe we should do extra check in proper place, or use string
export interface StdFee {
  Amount: any;
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
  alt_bytes?: string;
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
  Amount: null,
  Gas: 0
});

export function encodeTx(
  msg: any,
  msgType: string,
  pubKey: string,
  sig: string,
  seq: number
): string {
  const stdMsg: StdMsg = {
    type: msgType,
    value: msg
  };

  const stdSig: StdSignature = {
    pub_key: { type: 'AC26791624DE60', value: pubKey },
    signature: { type: '6BF5903DA1DB28', value: sig },
    sequence: seq
  };

  const stdTx: StdTx = {
    msg: stdMsg,
    signatures: [stdSig],
    fee: getZeroFee()
  };

  return btoa(JSON.stringify(stdTx));
}

export function encodeSignMsg(
  msg: any,
  chainId: string,
  seq: number
): StdSignMsg {
  const fee = getZeroFee();
  const stdSignMsg: StdSignMsg = {
    chain_id: chainId,
    sequences: [seq],
    fee_bytes: JSON.stringify(fee),
    msg_bytes: JSON.stringify(msg)
  };
  return stdSignMsg;
}

export function getPrivKeyFromHex(privHex: string): any {
  var ec = new elliptic.ec('secp256k1');
  return;
}
