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
    constructor(optionsService: OptionsService);
    /** Create and get the http client */
    client(): AxiosInstance;
    /** Get */
    get<T>(url: string, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    /** Post */
    post<T>(url: string, payload?: any, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    /** Patch */
    patch<T>(url: string, payload?: any, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    /** Delete */
    delete<T>(url: string, query?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    /** Helper to return a stringified query */
    private query;
}
export {};
