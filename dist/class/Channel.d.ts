import { ISerializable, IStorable } from '../interface/Storage';
import { IChannel } from '../interface/Objects';
import { IConfig } from '../interface/Config';
import { Template } from './Template';
import { Validator } from './Validator';
import { Project } from './Project';
import { ModelsCollection } from './ModelsCollection';
export declare class Channel implements IStorable, ISerializable<IChannel, Channel> {
    path: string;
    name: string;
    id: string;
    private static hapifyFolders;
    private static configFile;
    private static projectFile;
    config: IConfig;
    /** Templates instances */
    templates: Template[];
    /** Templates instances */
    validator: Validator;
    /** Current project */
    project: Project;
    /** List of models container */
    modelsCollection: ModelsCollection;
    templatesPath: string;
    /** Channel storage */
    private storageService;
    constructor(path: string, name?: string);
    load(): Promise<void>;
    save(): Promise<void>;
    private guessHapifyFolder;
    /** Denotes if the template should be considered as empty */
    isEmpty(): boolean;
    /** Remove empty templates */
    filter(): void;
    /** Determines if the project is an id or not and resolve path if necessary */
    guessProjectIdOrPath(): string;
    /** Change project in config file */
    static changeProject(path: string, project: string): Promise<void>;
    /** Returns the config from ori file */
    readConfigFile(): Promise<IConfig>;
    /** Denotes if the config file exists */
    static configExists(path: string): Promise<boolean>;
    /** Init a Hapify structure within a directory */
    static create(path: string, name?: string, description?: string, logo?: string): Promise<Channel>;
    fromObject(object: IChannel): Channel;
    toObject(): IChannel;
}
