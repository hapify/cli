import { PresetsCollection, Model } from '../class';
import { ChannelsService } from './Channels';
import { InfoService } from './Info';
export interface PresetMergeResults {
    created: Model[];
    updated: Model[];
}
export declare class PresetsService {
    private channelsService;
    private infoService;
    /**
     * Constructor
     */
    constructor(channelsService: ChannelsService, infoService: InfoService);
    /**
     * Returns the presets collection
     * @return {PresetsCollection}
     * @throws {Error}
     */
    collection(): Promise<PresetsCollection>;
    /**
     * Apply one preset to models
     */
    apply(presetModels: Model[]): Promise<PresetMergeResults>;
}
