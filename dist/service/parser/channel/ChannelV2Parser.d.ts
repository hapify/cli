import { VersionedObjectParser } from '../../../interface/Version';
import { IStorableCompactConfig } from '../../../interface/Storage';
export declare class ChannelV2Parser implements VersionedObjectParser<IStorableCompactConfig> {
    convert(input: IStorableCompactConfig): IStorableCompactConfig;
}
