import { ISerializable, IStorable } from '../interface/Storage';
import { IProject } from '../interface/Objects';
export declare class Project implements IStorable, ISerializable<IProject, Project>, IProject {
    /** The project's unique id */
    id: string;
    /** The project's unique id */
    created_at: number;
    /** The project's name */
    name: string;
    /** The project's description */
    description: string;
    /** The project's owner payload */
    owner: string | any;
    /** Project storage */
    private storageService;
    /** The loaded instances */
    private static instances;
    constructor(object?: IProject);
    /** Returns a singleton for this config */
    static getInstance(project: string): Promise<Project>;
    fromObject(object: IProject): Project;
    toObject(): IProject;
    load(): Promise<void>;
    save(): Promise<void>;
}
