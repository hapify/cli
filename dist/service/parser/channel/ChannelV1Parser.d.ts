import { VersionedObjectParser } from '../../../interface/Version';
import { IV1Config } from '../../../interface/legacy/v1/Config';
import { IStorableCompactConfig } from '../../../interface/Storage';
export declare class ChannelV1Parser implements VersionedObjectParser<IStorableCompactConfig> {
    private converterService;
    constructor();
    convert(input: IV1Config): IStorableCompactConfig;
}
