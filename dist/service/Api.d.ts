import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { OptionsService } from './Options';
declare type ErrorData = {
    [k: string]: any;
};
export declare class RichAxiosError implements AxiosError {
    name: string;
    message: string;
    stack?: string;
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse;
    data?: ErrorData;
    constructor(error: AxiosError);
    isAxiosError: boolean;
    toJSON: () => object;
}
export declare class ApiService {
    private optionsService;
    /** Http client */
    private http;
    /** Constructor */
    constructor(optionsService: OptionsService);
    /** Create and get the http client */
    client(): AxiosInstance;
    /** Get */
    get(url: string, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    /** Post */
    post(url: string, payload?: any, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    /** Patch */
    patch(url: string, payload?: any, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    /** Delete */
    delete(url: string, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    /** Helper to return a stringified query */
    private query;
}
export {};
