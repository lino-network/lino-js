import Query from './query';
import Broadcast from './broadcast';
import { ITransport, Transport, ITransportOptions } from './transport';
//import elliptic from 'elliptic';

export default class LINO {
  private _options: any;
  private _transport: ITransport;
  private _query: Query;
  private _broadcast: Broadcast;
  private _ec: any;

  constructor(opt: ITransportOptions) {
    this._options = opt;
    this._transport = new Transport(opt);
    this._query = new Query(this._transport);
    this._broadcast = new Broadcast(this._transport);
    //this._ec = new elliptic.ec('secp256k1');
  }

  get query(): Query {
    return this._query;
  }

  get broadcast(): Broadcast {
    return this._broadcast;
  }

  genPrivKeyHex() {
    ///return this._ec.genKeyPair().getPrivate('hex');
    // var priv = kp.getPrivate('hex');
    // var pub = kp.getPublic('hex')
    // console.log(priv);
    // console.log(pub);
    //return priv;
  }
}
