import { Service } from 'typedi';
import {ConfigRemote} from '../config';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import querystring from 'querystring';
import { OptionsService } from './Options';

export interface IApiModel {
  _id?: string;
  created_at?: number;
  updated_at?: number | null;
  version?: string;
  owner?: string | any;
  project?: string | any;
  name?: string;
  fields?: any[];
  accesses?: any;
}

export interface IApiPreset {
  _id?: string;
  created_at?: number;
  version?: string;
  name?: string;
  icon?: string;
  models?: IApiModel[];
}

@Service()
export class ApiService {

  /** Http client */
  private http: AxiosInstance;

  /** Constructor */
  constructor(private optionsService: OptionsService) {
    this.http = axios.create({
      baseURL: ConfigRemote.uri,
      headers: {
        'X-Api-Key': this.optionsService.apiKey()
      }
    });
  }

  /** Get */
  async get(url: string, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await this.http.get(this.query(url, query), config);
    } catch (e) {
      throw this.wrapError(e);
    }
  }

  /** Post */
  async post(url: string, payload?: any, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await this.http.post(this.query(url, query), payload, config);
    } catch (e) {
      throw this.wrapError(e);
    }
  }

  /** Patch */
  async patch(url: string, payload?: any, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await this.http.patch(this.query(url, query), payload, config);
    } catch (e) {
      throw this.wrapError(e);
    }
  }

  /** Delete */
  async delete(url: string, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await this.http.delete(this.query(url, query), config);
    } catch (e) {
      throw this.wrapError(e);
    }
  }

  /** Helper to return a stringified query */
  private query(url: string, object?: any): string {
    return !!object ? `${url}?${querystring.stringify(object)}` : url;
  }

  /** Parse and throw Error */
  private wrapError(error: AxiosError): AxiosError {
    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message;
    }
    return error;
  }
}
