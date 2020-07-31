import { IPreset, ISerializable } from '../interface';
import { Model } from './';
export declare class Preset implements ISerializable<IPreset, Preset>, IPreset {
    /** @type {string} The preset's unique id */
    id: string;
    /** @type {string} The preset icon */
    icon: string;
    /** @type {string} The preset's name */
    name: string;
    /** @type {string} The preset's name in french */
    name__fr: string;
    /** @type {string} The preset's name */
    description: string;
    /** @type {string} The preset's name in french */
    description__fr: string;
    /** @type {Model[]} The models of the model */
    models: Model[];
    /** Constructor */
    constructor(object?: IPreset);
    /** @inheritDoc */
    fromObject(object: IPreset): Preset;
    /** @inheritDoc */
    toObject(): IPreset;
}