import { ApiService } from './Api';
export declare class AuthenticatedApiService extends ApiService {
    /** Create and get the http client */
    client(): import("axios").AxiosInstance;
}
