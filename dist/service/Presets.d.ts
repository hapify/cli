import { ChannelsService } from './Channels';
import { InfoService } from './Info';
import { PresetsCollection } from '../class/PresetsCollection';
import { Model } from '../class/Model';
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
