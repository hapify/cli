import { BaseApiStorageService, BaseSearchParams } from './Base';
import { IPreset } from '../../../interface/Objects';
import { IApiPreset } from '../../../interface/Api';
import { OptionsService } from '../../Options';
import { ConverterService } from '../../Converter';
import { VersionedObject } from '../../../interface/Version';
interface PresetsSearchParams extends BaseSearchParams {
    version?: string;
    name?: string;
    slug?: string;
    models?: string[];
}
export declare class PresetsApiStorageService extends BaseApiStorageService<IPreset, IApiPreset, PresetsSearchParams> {
    private converterService;
    constructor(optionsService: OptionsService, converterService: ConverterService);
    protected defaultSearchParams(): any;
    protected path(): string;
    protected convertToCurrentVersion(object: VersionedObject | IApiPreset): IApiPreset;
    protected fromApi(object: IApiPreset): IPreset;
    protected requiresAuthentication(): boolean;
}
export {};
