/** Random function */
import { ISerializable } from '../interface/Storage';
import { IAccesses, IModel } from '../interface/Generator';
import { Field } from './Field';
export declare class Model implements ISerializable<IModel, Model>, IModel {
    /** @type {string} The model's unique id */
    id: string;
    /** @type {string} The model's name */
    name: string;
    /** @type {string} The model's notes */
    notes?: string;
    /** @type {Field[]} The fields of the model */
    fields: Field[];
    /** @type IAccesses The model privacy access */
    accesses: IAccesses;
    /** Constructor */
    constructor(object?: IModel);
    /** @inheritDoc */
    fromObject(object: IModel): Model;
    /** @inheritDoc */
    toObject(): IModel;
    /**
     * Randomly generate id
     *
     * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
     * @returns {string}
     */
    static generateTempId(): string;
    /** Get default accesses */
    static defaultAccesses(): IAccesses;
    /** Clone the model to a new reference */
    clone(newId: boolean): Model;
}
