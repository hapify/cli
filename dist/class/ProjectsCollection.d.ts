import { ISerializable, IStorable } from '../interface/Storage';
import { IProject } from '../interface/Objects';
import { Project } from './Project';
export declare class ProjectsCollection implements IStorable, ISerializable<IProject[], Project[]> {
    /** The list of project instances */
    private projects;
    /** Projects storage */
    private storageService;
    private constructor();
    /** Returns a singleton for this config */
    static getInstance(): Promise<ProjectsCollection>;
    /** Load the projects */
    load(): Promise<void>;
    save(): Promise<void>;
    /** Returns the list of projects */
    list(): Promise<Project[]>;
    /** Returns one project */
    get(id: string): Promise<Project>;
    /** Create new project */
    add(name: string, description: string): Promise<Project>;
    fromObject(object: IProject[]): Project[];
    toObject(): IProject[];
}
