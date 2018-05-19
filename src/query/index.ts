import { ITransport } from '../transport';
import Keys from './keys';
import * as DEBUG from 'debug';
const debug = DEBUG('Query');

export default class Query {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  getAllValidators(): Promise<AllValidators | null> {
    // query: get key(byte[] AKA ByteBuffer) and KVStoreKey(string), send to transport
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    const validatorListKey = Keys.getValidatorListKey();
    const path = `/${ValidatorKVStoreKey}/key`;
    debug(`ValidatorKVStoreKey: ${ValidatorKVStoreKey}`);
    debug(`validatorListKey: ${validatorListKey}`);
    // transport: get path and key for ABCIQuery and return result
    // get transport's node and do ABCIQuery
    // rpc client do rpc call
    // check resp
    return this._transport.query<AllValidators>(validatorListKey, path);
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
