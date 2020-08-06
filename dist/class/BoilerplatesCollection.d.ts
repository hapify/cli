import { ISerializable, IStorable } from '../interface/Storage';
import { IBoilerplate } from '../interface/Objects';
import { Boilerplate } from './Boilerplate';
export declare class BoilerplatesCollection implements IStorable, ISerializable<IBoilerplate[], Boilerplate[]> {
    /** @type {Boilerplate[]} The list of boilerplate instances */
    private boilerplates;
    /** Boilerplates storage */
    private storageService;
    /** @type {string} The loaded instance */
    private static instance;
    /** Constructor */
    private constructor();
    /** Returns a singleton for this config */
    static getInstance(): Promise<BoilerplatesCollection>;
    /**
     * Load the boilerplates
     * @return {Promise<void>}
     */
    load(): Promise<void>;
    /** @inheritDoc */
    save(): Promise<void>;
    /**
     * Returns the list of boilerplates
     * @returns {Promise<Boilerplate[]>}
     */
    list(): Promise<Boilerplate[]>;
    /**
     * Returns one boilerplate
     * @returns {Promise<Boilerplate>}
     */
    get(id: string): Promise<Boilerplate>;
    /**
     * Returns one boilerplate by its slug
     * @returns {Promise<Boilerplate>}
     */
    getBySlug(slug: string): Promise<Boilerplate>;
    /** @inheritDoc */
    fromObject(object: IBoilerplate[]): Boilerplate[];
    /** @inheritDoc */
    toObject(): IBoilerplate[];
}
