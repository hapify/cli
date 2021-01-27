import { BaseApiStorageService, BaseSearchParams } from './Base';
import { IModel } from '../../../interface/Generator';
import { VersionedObject } from '../../../interface/Version';
import { IApiModel } from '../../../interface/Api';
import { OptionsService } from '../../Options';
import { ConverterService } from '../../Converter';
interface ModelsSearchParams extends BaseSearchParams {
    version?: string;
    project?: string;
    name?: string;
}
export declare class ModelsApiStorageService extends BaseApiStorageService<IModel, IApiModel, ModelsSearchParams> {
    private converterService;
    /** The models fingerprints */
    private hashes;
    constructor(optionsService: OptionsService, converterService: ConverterService);
    /** Load the models from api for a specific project */
    forProject(project: string): Promise<IModel[]>;
    /** Send models to API if necessary */
    set(project: string, models: IModel[]): Promise<IModel[]>;
    /** Update hashes from models */
    private updateHashes;
    /** Create a hash for the model */
    private static hash;
    protected defaultSearchParams(): any;
    protected path(): string;
    protected convertToCurrentVersion(object: VersionedObject | IApiModel): IApiModel;
    protected fromApi(object: IApiModel): IModel;
    protected requiresAuthentication(): boolean;
}
export {};
