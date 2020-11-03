import { ISerializable, IStorable } from '../interface/Storage';
import { IBoilerplate } from '../interface/Objects';
import { Boilerplate } from './Boilerplate';
export declare class BoilerplatesCollection implements IStorable, ISerializable<IBoilerplate[], Boilerplate[]> {
    /** The list of boilerplate instances */
    private boilerplates;
    /** Boilerplates storage */
    private storageService;
    private constructor();
    /** Returns a singleton for this config */
    static getInstance(): Promise<BoilerplatesCollection>;
    /** Load the boilerplates */
    load(): Promise<void>;
    save(): Promise<void>;
    /** Returns the list of boilerplates */
    list(): Promise<Boilerplate[]>;
    /** Returns one boilerplate */
    get(id: string): Promise<Boilerplate>;
    /** Returns one boilerplate by its slug */
    getBySlug(slug: string): Promise<Boilerplate>;
    fromObject(object: IBoilerplate[]): Boilerplate[];
    toObject(): IBoilerplate[];
}
