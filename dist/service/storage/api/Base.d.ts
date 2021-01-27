import { OptionsService } from '../../Options';
import { IStorageService } from '../../../interface/Storage';
import { IRemoteConfig } from '../../../interface/Config';
import { VersionedObject } from '../../../interface/Version';
/** Used to export and import search params */
export interface BaseSearchParams {
    _page?: string | number;
    _limit?: string | number;
    _sort?: string;
    _order?: string;
    _id?: string[];
}
export declare abstract class BaseApiStorageService<T, I, S extends BaseSearchParams> implements IStorageService<T> {
    private optionsService;
    /** Stores the remote config to use */
    protected remoteConfig: IRemoteConfig;
    /** Api service to use (authenticated or not) */
    private apiService;
    constructor(optionsService: OptionsService);
    /** Create a new model */
    create(payload: Partial<I>): Promise<T>;
    /** Update an model selected from it's id */
    update(id: string, payload: Partial<I>): Promise<void>;
    /** Get an model from it's id */
    get(id: string): Promise<T>;
    /** Delete an model selected from it's id */
    remove(id: string): Promise<void>;
    /** Get list for model search */
    list(searchParams?: S): Promise<T[]>;
    /** Count for model */
    count(searchParams?: S): Promise<number>;
    /** Get the default search params (limit, page, etc...) */
    protected defaultSearchParams(): S;
    /** Denotes if the calls to the API need the X-Api-Token header */
    protected abstract requiresAuthentication(): boolean;
    /** Returns the base URI for this model */
    protected abstract path(): string;
    /** Convert an old payload to new payload */
    protected parsePayloadFromApi(object: VersionedObject | I): T;
    /** Convert payload accordingly to version */
    protected convertToCurrentVersion(object: VersionedObject | I): I;
    /** Convert an incoming payload to an internal payload */
    protected abstract fromApi(object: I): T;
    /** Helper to merge search params */
    protected mergeSearchParams(searchParams?: S): S;
}
