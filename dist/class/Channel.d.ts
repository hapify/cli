import { IChannel, IConfig, ISerializable, IStorable } from '../interface';
import { ModelsCollection, Project, Template, Validator } from './';
export declare class Channel implements IStorable, ISerializable<IChannel, Channel> {
    path: string;
    /** @type {string} */
    name: string;
    /** @type {string} */
    id: string;
    /** @type {string} */
    private static defaultFolder;
    /** @type {string} */
    private static configFile;
    /** @type {IConfig} */
    config: IConfig;
    /** @type {Template[]} Templates instances */
    templates: Template[];
    /** @type {Template[]} Templates instances */
    validator: Validator;
    /** @type {Project} Current project */
    project: Project;
    /** @type {ModelsCollection} List of models container */
    modelsCollection: ModelsCollection;
    /** @type {string} */
    templatesPath: string;
    /** Channel storage */
    private storageService;
    /**
     * Constructor
     * @param {string} path
     * @param {string|null} name
     */
    constructor(path: string, name?: string);
    /** @inheritDoc */
    load(): Promise<void>;
    /** @inheritDoc */
    save(): Promise<void>;
    /**
     * Denotes if the template should be considered as empty
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Remove empty templates
     * @returns {void}
     */
    filter(): void;
    /**
     * Check resource validity
     * @throws {Error}
     */
    private validate;
    /** Change project in config file */
    static changeProject(path: string, project: string): Promise<void>;
    /** Denotes if the config file exists */
    static configExists(path: string): Promise<boolean>;
    /** Init a Hapify structure within a directory */
    static create(path: string, name?: string, description?: string, logo?: string): Promise<Channel>;
    /** @inheritDoc */
    fromObject(object: IChannel): Channel;
    /** @inheritDoc */
    toObject(): IChannel;
}
