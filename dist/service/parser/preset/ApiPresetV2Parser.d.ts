import { VersionedObjectParser } from '../../../interface/Version';
import { IApiPreset } from '../../../interface/Api';
export declare class ApiPresetV2Parser implements VersionedObjectParser<IApiPreset> {
    convert(input: IApiPreset): IApiPreset;
}
