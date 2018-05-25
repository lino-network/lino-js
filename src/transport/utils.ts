import { Coin } from '../query';
import shajs from 'sha.js';

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
  pubKey: string,
  sig: string,
  seq: number
): string {
  const stdMsg: StdMsg = {
    type: msgType,
    value: msg
  };

  const stdSig: StdSignature = {
    pub_key: {
      type: 'F8CCEAEB5AE980',
      value: 'AsUp4QNAe0vOuJNa5ZFuTi6bC5vz0ZmKk2yKADWmjEXD'
    },
    signature: { type: '6D1EA416E1FEE8', value: sig },
    sequence: seq
  };

  const stdTx: StdTx = {
    msg: stdMsg,
    signatures: [stdSig],
    fee: getZeroFee()
  };
  const jsonStr = JSON.stringify(stdTx);
  console.log(jsonStr);
  return btoa(jsonStr);
}

export function encodeSignMsg(msg: any, chainId: string, seq: number): any {
  const fee = getZeroFee();
  const stdSignMsg: StdSignMsg = {
    chain_id: chainId,
    sequences: [seq],
    fee_bytes: btoa(JSON.stringify(fee)),
    msg_bytes: btoa(JSON.stringify(msg)),
    alt_bytes: null
  };

  const jsonStr = JSON.stringify(stdSignMsg);
  console.log(jsonStr);

  console.log('here');
  const signMsgHash = shajs('sha256')
    .update(jsonStr)
    .digest();
  console.log(
    shajs('sha256')
      .update(jsonStr)
      .digest()
  );
  return signMsgHash;
}
