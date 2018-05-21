import Query from './query';
import Broadcast from './broadcast';
import { ITransport, Transport, ITransportOptions } from './transport';

export default class LINO {
  private _options: any;
  private _transport: ITransport;
  private _query: Query;
  private _broadcast: Broadcast;

  constructor(opt: ITransportOptions) {
    this._options = opt;
    this._transport = new Transport(opt);
    this._query = new Query(this._transport);
    this._broadcast = new Broadcast(this._transport);
  }

  get query(): Query {
    return this._query;
  }

  get broadcast(): Broadcast {
    return this._broadcast;
  }
}
