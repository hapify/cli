import { BaseApiStorageService, BaseSearchParams } from './Base';
import { IApiModel } from './Models';
import { IPreset } from '../../../interface/Objects';
interface PresetsSearchParams extends BaseSearchParams {
    version?: string;
    name?: string;
    slug?: string;
    models?: string[];
}
export interface IApiPreset {
    _id?: string;
    created_at?: number;
    version?: string;
    name?: string;
    name__fr?: string;
    description?: string;
    description__fr?: string;
    slug?: string;
    icon?: string;
    models?: IApiModel[];
}
export declare class PresetsApiStorageService extends BaseApiStorageService<IPreset, IApiPreset, PresetsSearchParams> {
    protected defaultSearchParams(): any;
    protected path(): string;
    protected fromApi(object: IApiPreset): IPreset;
    protected requiresAuthentication(): boolean;
}
export {};
