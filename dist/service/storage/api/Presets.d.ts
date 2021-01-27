import { BaseApiStorageService, BaseSearchParams } from './Base';
import { IPreset } from '../../../interface/Objects';
import { IApiPreset } from '../../../interface/Api';
import { OptionsService } from '../../Options';
import { ConverterService } from '../../Converter';
import { VersionedObject } from '../../../interface/Version';
import { VersionService } from '../../Version';
interface PresetsSearchParams extends BaseSearchParams {
    version?: string;
    name?: string;
    slug?: string;
    models?: string[];
}
export declare class PresetsApiStorageService extends BaseApiStorageService<IPreset, IApiPreset, PresetsSearchParams> {
    private converterService;
    private versionService;
    constructor(optionsService: OptionsService, converterService: ConverterService, versionService: VersionService);
    protected defaultSearchParams(): any;
    protected path(): string;
    protected convertToCurrentVersion(object: VersionedObject | IApiPreset): IApiPreset;
    protected fromApi(object: IApiPreset): IPreset;
    protected requiresAuthentication(): boolean;
}
export {};
