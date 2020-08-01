import { IGlobalConfig } from '../interface/IGlobalConfig';
export declare class GlobalConfigService {
    /** Define the config root path */
    private rootPath;
    /** The config file name */
    private filename;
    /** The config file path */
    private filePath;
    /** Store the config data */
    private data;
    /** Constructor */
    constructor();
    /** Create file if not exists */
    private init;
    /** Save data to config file */
    private save;
    /** Load data from config file */
    private load;
    /** Validate the current config or scream */
    private validate;
    /** Returns the configs */
    getData(): IGlobalConfig;
    /** Validate and save the configs */
    setData(data: IGlobalConfig): void;
}
