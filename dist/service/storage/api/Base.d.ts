import { OptionsService } from '../../Options';
import { ApiService } from '../../Api';
import { IStorageService } from '../../../interface/Storage';
import { IRemoteConfig } from '../../../interface/Config';
/** Used to export and import search params */
export interface BaseSearchParams {
    _page?: string | number;
    _limit?: string | number;
    _sort?: string;
    _order?: string;
    _id?: string[];
}
export declare abstract class BaseApiStorageService<T, I, S extends BaseSearchParams> implements IStorageService<T> {
    private apiService;
    private optionsService;
    /** Stores the remote config to use */
    protected remoteConfig: IRemoteConfig;
    /** Constructor */
    constructor(apiService: ApiService, optionsService: OptionsService);
    /**
     * Create a new model
     * @param {I} payload
     * @return {Promise<T>}
     */
    create(payload: I): Promise<T>;
    /**
     * Update an model selected from it's id
     * @param {string} id
     * @param {T} payload
     * @return {Promise<any>}
     */
    update(id: string, payload: I): Promise<void>;
    /**
     * Get an model from it's id
     * @param {string} id
     * @return {Promise<T>}
     */
    get(id: string): Promise<T>;
    /**
     * Delete an model selected from it's id
     * @param {string} id
     * @return {Promise<any>}
     */
    remove(id: string): Promise<void>;
    /**
     * Get list for model search
     * @param {S} searchParams
     * @return {Promise<T[]> >}
     */
    list(searchParams?: S): Promise<T[]>;
    /**
     * Count for model
     * @param {S} searchParams
     * @return {Promise<number>}
     */
    count(searchParams: S): Promise<number>;
    /** Get the default search params (limit, page, etc...) */
    protected defaultSearchParams(): any;
    /** Returns the base URI for this model */
    protected abstract path(): string;
    /** Convert an incoming payload to an internal payload */
    protected abstract fromApi(object: I): T;
}
