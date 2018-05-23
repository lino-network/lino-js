import * as elliptic from 'elliptic';

// TODO: for int64, maybe we should do extra check in proper place, or use string
export interface Fee {
  amount: number[];
  gas: number;
}

export interface Signature {
  pub_key: any;
  signature: any;
  sequence: number;
}

export interface Transaction {
  msg: any;
  fee: Fee;
  signatures: Signature[];
}

export interface SignMsg {
  chain_id: string;
  sequences: number[];
  fee_bytes: string;
  msg_bytes: string;
  alt_bytes?: string;
}

// return a new zero fee object
export const getZeroFee: () => Fee = () => ({
  amount: [],
  gas: 0
});

export function encodeTx(
  msg: any,
  pubKey: any,
  sig: any,
  seq: number
): Transaction {
  const stdSig: Signature = {
    pub_key: pubKey,
    signature: sig,
    sequence: seq
  };
  const stdTx: Transaction = {
    msg: msg,
    signatures: [stdSig],
    fee: getZeroFee()
  };
  return stdTx;
}

export function encodeSignMsg(msg: any, chainId: string, seq: number): SignMsg {
  const fee = getZeroFee();
  const stdSignMsg: SignMsg = {
    chain_id: chainId,
    sequences: [seq],
    fee_bytes: JSON.stringify(fee),
    msg_bytes: JSON.stringify(msg)
  };
  return stdSignMsg;
}

export function getPrivKeyFromHex(privHex: string): any {
  // const ec = new EdDSA('ed25519');
  return;
}
