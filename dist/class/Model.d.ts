import { ISerializable } from '../interface/Storage';
import { IAccesses, IModel } from '../interface/Generator';
import { Field } from './Field';
export declare class Model implements ISerializable<IModel, Model>, IModel {
    /** The model's unique id */
    id: string;
    /** The model's name */
    name: string;
    /** The model's notes */
    notes?: string;
    /** The fields of the model */
    fields: Field[];
    /** The model privacy access */
    accesses: IAccesses;
    constructor(object?: IModel);
    fromObject(object: IModel): Model;
    toObject(): IModel;
    /**
     * Randomly generate id
     *
     */
    static generateTempId(): string;
    /** Get default accesses */
    static defaultAccesses(): IAccesses;
    /** Clone the model to a new reference */
    clone(newId: boolean): Model;
}
