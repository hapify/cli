import { Service } from 'typedi';
import { ConfigRemote } from '../config';
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse
} from 'axios';
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

type ErrorData = { [k: string]: any };
export class RichAxiosError implements AxiosError {
	name: string;
	message: string;
	stack?: string;
	config: AxiosRequestConfig;
	code?: string;
	request?: any;
	response?: AxiosResponse;
	data?: ErrorData;
	constructor(error: AxiosError) {
		this.name = 'RichAxiosError';
		this.stack = error.stack;
		this.config = error.config;
		this.code = error.code;
		this.request = error.request;
		this.response = error.response;
		// Get message and payload if possible
		if (error.response && error.response.data) {
			this.message = error.response.data.message;
			this.data = error.response.data.data;
		} else {
			this.message = error.message;
		}
	}
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
	async get(
		url: string,
		query?: any,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			return await this.http.get(this.query(url, query), config);
		} catch (e) {
			throw new RichAxiosError(e);
		}
	}

	/** Post */
	async post(
		url: string,
		payload?: any,
		query?: any,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			return await this.http.post(
				this.query(url, query),
				payload,
				config
			);
		} catch (e) {
			throw new RichAxiosError(e);
		}
	}

	/** Patch */
	async patch(
		url: string,
		payload?: any,
		query?: any,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			return await this.http.patch(
				this.query(url, query),
				payload,
				config
			);
		} catch (e) {
			throw new RichAxiosError(e);
		}
	}

	/** Delete */
	async delete(
		url: string,
		query?: any,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse> {
		try {
			return await this.http.delete(this.query(url, query), config);
		} catch (e) {
			throw new RichAxiosError(e);
		}
	}

	/** Helper to return a stringified query */
	private query(url: string, object?: any): string {
		return !!object ? `${url}?${querystring.stringify(object)}` : url;
	}
}
