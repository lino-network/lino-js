require('es6-promise/auto');
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

export interface ITransport {
  send<T = any>(config: AxiosRequestConfig): Promise<T>;
}

export class Transport implements ITransport {
  constructor() {}

  // Config doc: https://github.com/axios/axios#request-config
  send<T = any>(config: AxiosRequestConfig): Promise<T> {
    // TODO: deal with error
    return axios.request<T>(config).then(res => res.data);
  }
}
