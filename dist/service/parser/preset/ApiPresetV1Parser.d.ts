import { VersionedObjectParser } from '../../../interface/Version';
import { IApiPreset } from '../../../interface/Api';
import { IV1ApiPreset } from '../../../interface/legacy/v1/Api';
export declare class ApiPresetV1Parser implements VersionedObjectParser<IApiPreset> {
    convert(input: IV1ApiPreset): IApiPreset;
}
