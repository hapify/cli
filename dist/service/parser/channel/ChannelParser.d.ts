import { VersionScope } from '../../../interface/Version';
import { ChannelV1Parser } from './ChannelV1Parser';
import { ChannelV2Parser } from './ChannelV2Parser';
import { Parser } from '../Parser';
import { IStorableCompactConfig } from '../../../interface/Storage';
export declare class ChannelParser extends Parser<IStorableCompactConfig> {
    protected getScope(): VersionScope;
    protected getWorkersMap(): {
        '1': typeof ChannelV1Parser;
        '2': typeof ChannelV2Parser;
    };
}
