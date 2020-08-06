import { OptionsService } from './Options';
import { Channel } from '../class/Channel';
import { ModelsCollection } from '../class/ModelsCollection';
export declare class ChannelsService {
    private optionsService;
    /** Channels instances */
    private _channels;
    constructor(optionsService: OptionsService);
    /** Get the channels. Load them if not loaded yet */
    channels(): Promise<Channel[]>;
    /** Ensure that all channels refers to the same project */
    ensureSameProject(): Promise<void>;
    /** Ensure that all channels define the same default fields */
    ensureSameDefaultFields(): Promise<void>;
    /**
     * Change project in all found channels from a given or current dir
     * Returns modified channels
     * Defined path for a specific channel
     */
    changeProject(project: string, path?: string): Promise<void>;
    /** Returns the first models collection */
    modelsCollection(): Promise<ModelsCollection>;
    /**
     * This method detect all channels in the directory and its sub-directories, and create instances for them.
     * We can define the depth level of subdirectories.
     */
    private static sniff;
}
