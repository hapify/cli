import { VersionScope } from '../../../interface/Version';
import { ApiPresetV1Parser } from './ApiPresetV1Parser';
import { Parser } from '../Parser';
import { IApiPreset } from '../../../interface/Api';
import { ApiPresetV2Parser } from './ApiPresetV2Parser';
export declare class ApiPresetParser extends Parser<IApiPreset> {
    protected getScope(): VersionScope;
    protected getWorkersMap(): {
        '1': typeof ApiPresetV1Parser;
        '2': typeof ApiPresetV2Parser;
    };
}
