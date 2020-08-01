import { IStorable } from '../interface/IStorable';
import { ISerializable } from '../interface/ISerializable';
import { IModel } from '../interface/IObjects';
import { Model } from './Model';
export declare class ModelsCollection implements IStorable, ISerializable<IModel[], Model[]> {
    project: string;
    /** @type {Model[]} The list of model instances */
    private models;
    /** @type {string} The pseudo path */
    path: string;
    /** The loaded instances */
    private static instances;
    /** Presets storage */
    private storageService;
    /**
     * Constructor
     * @param {string} project
     */
    private constructor();
    /**
     * Returns a singleton for this config
     * @param {string} project
     */
    static getInstance(project: string): Promise<ModelsCollection>;
    /** @inheritDoc */
    load(): Promise<void>;
    /** @inheritDoc */
    save(): Promise<void>;
    /** Add one or more object to the stack */
    add(object: IModel | IModel[]): Promise<void>;
    /** Upsert one or more object to the stack */
    update(object: IModel | IModel[]): Promise<void>;
    /** Remove an existing object */
    remove(object: IModel | IModel[]): Promise<void>;
    /**
     * Find a instance with its id
     * @param {string} id
     * @returns {Promise<Model|null>}
     */
    find(id: string): Promise<Model | null>;
    /**
     * Returns the list of models
     * @returns {Promise<Model[]>}
     */
    list(): Promise<Model[]>;
    /** @inheritDoc */
    fromObject(object: IModel[]): Model[];
    /** @inheritDoc */
    toObject(): IModel[];
    /**
     * Returns a pseudo path
     * @returns {string}
     */
    private static path;
}
