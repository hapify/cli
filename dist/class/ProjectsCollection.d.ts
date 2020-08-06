import { ISerializable, IStorable } from '../interface/Storage';
import { IProject } from '../interface/Objects';
import { Project } from './Project';
export declare class ProjectsCollection implements IStorable, ISerializable<IProject[], Project[]> {
    /** @type {Project[]} The list of project instances */
    private projects;
    /** Projects storage */
    private storageService;
    /** @type {string} The loaded instance */
    private static instance;
    /** Constructor */
    private constructor();
    /** Returns a singleton for this config */
    static getInstance(): Promise<ProjectsCollection>;
    /**
     * Load the projects
     * @return {Promise<void>}
     */
    load(): Promise<void>;
    /** @inheritDoc */
    save(): Promise<void>;
    /**
     * Returns the list of projects
     * @returns {Promise<Project[]>}
     */
    list(): Promise<Project[]>;
    /**
     * Returns one project
     * @returns {Promise<Project>}
     */
    get(id: string): Promise<Project>;
    /**
     * Returns one project
     * @returns {Promise<Project>}
     */
    add(name: string, description: string): Promise<Project>;
    /** @inheritDoc */
    fromObject(object: IProject[]): Project[];
    /** @inheritDoc */
    toObject(): IProject[];
}
