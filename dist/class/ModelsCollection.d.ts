import { ISerializable, IStorable } from '../interface/Storage';
import { IModel } from '../interface/Generator';
import { Model } from './Model';
import { Project } from './Project';
export declare class ModelsCollection implements IStorable, ISerializable<IModel[], Model[]> {
    private project;
    /** The list of model instances */
    private models;
    /** The pseudo path */
    path: string;
    /** Models storage */
    private remoteStorageService;
    private localStorageService;
    private constructor();
    /** Returns a singleton for this config */
    static getInstance(project: Project): Promise<ModelsCollection>;
    load(): Promise<void>;
    save(): Promise<void>;
    /** Add one or more object to the stack */
    add(object: IModel | IModel[]): Promise<void>;
    /** Upsert one or more object to the stack */
    update(object: IModel | IModel[]): Promise<void>;
    /** Remove an existing object */
    remove(object: IModel | IModel[]): Promise<void>;
    /** Find a instance with its id */
    find(id: string): Promise<Model | null>;
    /** Returns the list of models */
    list(): Promise<Model[]>;
    fromObject(object: IModel[]): Model[];
    toObject(): IModel[];
    /** Returns a pseudo path */
    private static path;
}
