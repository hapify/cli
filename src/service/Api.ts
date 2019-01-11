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
  async get(url: string, object?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await this.http.get(this.query(url, object), config);
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
