import { IModel } from '../../../interface';
import { BaseSearchParams, BaseApiStorageService } from './Base';
interface ModelsSearchParams extends BaseSearchParams {
    version?: string;
    project?: string;
    name?: string;
}
export interface IApiModel {
    _id?: string;
    created_at?: number;
    updated_at?: number | null;
    version?: string;
    owner?: string | any;
    project?: string | any;
    name?: string;
    notes?: string;
    fields?: any[];
    accesses?: any;
}
export declare class ModelsApiStorageService extends BaseApiStorageService<IModel, IApiModel, ModelsSearchParams> {
    /** The models fingerprints */
    private hashes;
    /** Load the models from api for a specific project */
    forProject(project: string): Promise<IModel[]>;
    /** Send models to API if necessary */
    set(project: string, models: IModel[]): Promise<IModel[]>;
    /** Update hashes from models */
    private updateHashes;
    /** Create a hash for the model */
    private static hash;
    /** @inheritDoc */
    protected defaultSearchParams(): any;
    /** @inheritDoc */
    protected path(): string;
    /** @inheritDoc */
    protected fromApi(object: IApiModel): IModel;
}
export {};