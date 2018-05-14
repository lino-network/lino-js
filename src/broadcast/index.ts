import { ITransport } from '../transport';

export default class Broadcast {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }
}
