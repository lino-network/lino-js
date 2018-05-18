import { ITransport } from '../transport';
import Keys from './keys';

export default class Query {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  getAllValidators(): Promise<AllValidators> {
    // query: get key(byte[]) and KVStoreKey(string), send to transport
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    const validatorListKey = Keys.getValidatorListKey();
    // transport: get path and key for ABCIQuery and return result
    // get transport's node and do ABCIQuery
    // rpc client do rpc call
    // check resp
    return this._transport.send<AllValidators>({
      // TODO: confirm API endpoint
      url: '/allValidators'
    });
  }
}

// Type defination
interface Coin {
  amount: number;
}

interface AllValidators {
  oncallValidators: string[];
  allValidators: string[];
  preBlockValidators: string[];
  lowestPower: Coin;
  lowestValidator: string;
}
