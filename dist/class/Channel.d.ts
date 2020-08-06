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
    private static defaultFolder;
    private static configFile;
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
    /** Denotes if the template should be considered as empty */
    isEmpty(): boolean;
    /** Remove empty templates */
    filter(): void;
    /** Check resource validity */
    private validate;
    /** Change project in config file */
    static changeProject(path: string, project: string): Promise<void>;
    /** Denotes if the config file exists */
    static configExists(path: string): Promise<boolean>;
    /** Init a Hapify structure within a directory */
    static create(path: string, name?: string, description?: string, logo?: string): Promise<Channel>;
    fromObject(object: IChannel): Channel;
    toObject(): IChannel;
}
