import { FilePath, SingleSaveFileStorage } from './SingleSave';
import { IConfig } from '../../../interface/Config';
import { ConverterService } from '../../Converter';
export declare class ChannelFileStorageService extends SingleSaveFileStorage<IConfig> {
    private converterService;
    constructor(converterService: ConverterService);
    protected serialize(content: IConfig): Promise<string>;
    protected deserialize(content: string): Promise<IConfig>;
    /** Cleanup unused files */
    cleanup(root: FilePath, legitFiles: FilePath[]): Promise<void>;
    /** Get all files' absolute path from a directory */
    private static listAllFiles;
    /** Delete all directories if empty */
    private static clearEmptyDirectories;
}
