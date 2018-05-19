export interface IResponseQuery {
  code: number;
  log: string;
  info: string;
  index: number;
  key: string;
  value: Object | null;
  proof: string;
  height: number;
}

export class Rpc {
  private _nodeUrl: string;

  constructor(nodeUrl: string) {
    this._nodeUrl = nodeUrl;
  }

  abciQuery<T>(path: string, key: ByteBuffer): Promise<IResponseQuery> {
    return Promise.resolve().then(() => ({
      code: 1,
      log: '',
      info: '',
      index: 1,
      key: '',
      value: null,
      proof: '',
      height: 1
    }));
  }
}
