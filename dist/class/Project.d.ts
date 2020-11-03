import { ISerializable, IStorable, StorageType } from '../interface/Storage';
import { IProject } from '../interface/Objects';
import { Channel } from './Channel';
export declare class Project implements IStorable, ISerializable<IProject, Project>, IProject {
    /** The project's unique id */
    private _id;
    get id(): string;
    set id(value: string);
    /** The project's creation date */
    created_at?: number;
    /** The project's name */
    name: string;
    /** The project's description */
    description?: string;
    /** Storage type */
    private _storageType;
    get storageType(): StorageType;
    /** Project storage */
    private remoteStorageService;
    private localStorageService;
    constructor(object?: IProject);
    /** Returns a singleton for this config */
    static getInstance(project: string): Promise<Project>;
    fromObject(object: IProject): Project;
    toObject(): IProject;
    load(): Promise<void>;
    save(): Promise<void>;
    static createLocalForChannel(channel: Channel, name?: string, description?: string): Promise<void>;
    static isRemoteId(value: string): boolean;
    setNameAndDescription(name: string, description?: string): void;
}
