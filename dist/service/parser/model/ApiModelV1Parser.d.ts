import { VersionedObjectParser } from '../../../interface/Version';
import { IV1ApiModel } from '../../../interface/legacy/v1/Api';
import { IApiModel } from '../../../interface/Api';
export declare class ApiModelV1Parser implements VersionedObjectParser<IApiModel> {
    private converterService;
    constructor();
    convert(input: IV1ApiModel): IApiModel;
}
