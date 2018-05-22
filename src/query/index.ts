import { ITransport } from '../transport';
import Keys from './keys';

export default class Query {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  getAllValidators(): Promise<AllValidators | null> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    const validatorListKey = Keys.getValidatorListKey();
    const path = `/${ValidatorKVStoreKey}/key`;
    return this._transport.query<AllValidators>(validatorListKey, path);
  }

  getValidator(username: string): Promise<Validator | null> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    const validatorKey = Keys.getValidatorKey(username);
    const path = `/${ValidatorKVStoreKey}/key`;
    return this._transport.query<Validator>(validatorKey, path);
  }
}

// Type defination
export interface Coin {
  amount: number;
}

export interface AllValidators {
  oncallValidators: string[];
  allValidators: string[];
  preBlockValidators: string[];
  lowestPower: Coin;
  lowestValidator: string;
}

export interface  ABCIValidator {
	PubKey: string;
	Power:  number;
}


export interface  Validator {
	abci: ABCIValidator;
	Username:       string;
	Deposit:        Coin;
	AbsentCommit:   number;
	ProducedBlocks: number;
	Link:           string;
}
