import { VersionedObjectParser } from '../../../interface/Version';
import { IApiModel } from '../../../interface/Api';
export declare class ApiModelV2Parser implements VersionedObjectParser<IApiModel> {
    convert(input: IApiModel): IApiModel;
}
