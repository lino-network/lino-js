import { ITransport } from '../transport';

export default class Query {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  getAllValidators(): Promise<AllValidators> {
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
