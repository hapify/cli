import { VersionScope } from '../../../interface/Version';
import { ApiModelV1Parser } from './ApiModelV1Parser';
import { ApiModelV2Parser } from './ApiModelV2Parser';
import { Parser } from '../Parser';
import { IApiModel } from '../../../interface/Api';
export declare class ApiModelParser extends Parser<IApiModel> {
    protected getScope(): VersionScope;
    protected getWorkersMap(): {
        '1': typeof ApiModelV1Parser;
        '2': typeof ApiModelV2Parser;
    };
}
