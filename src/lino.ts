import Query from './query';
import Broadcast from './broadcast';

export default class LINO {
  private _options: any;
  private _query: Query;
  private _broadcast: Broadcast;

  constructor(opt = {}) {
    this._options = opt;
    this._query = new Query();
    this._broadcast = new Broadcast();
  }
}
