import { ITransport } from '../transport';

export default class Broadcast {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  transfer(
    sender: string,
    receiver_name: string,
    receiver_addr: string,
    amount: string,
    memo: string,
    privKeyHex: string
  ) {
    const msg: TransferMsg = {
      sender,
      receiver_name,
      receiver_addr,
      amount,
      memo
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  private _broadcastTransaction(msg: any, privKeyHex: string) {
    // SignBuildBroadcast
    const res = this._transport.signBuildBroadcast(msg, privKeyHex, 0);
    return 0;
  }
}

export interface TransferMsg {
  sender: string;
  receiver_name: string;
  receiver_addr: string;
  amount: string;
  memo: string;
}
