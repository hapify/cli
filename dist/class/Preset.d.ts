import { ISerializable } from '../interface/Storage';
import { IPreset } from '../interface/Objects';
import { Model } from './Model';
export declare class Preset implements ISerializable<IPreset, Preset>, IPreset {
    /** The preset's unique id */
    id: string;
    /** The preset icon */
    icon: string;
    /** The preset's name */
    name: string;
    /** The preset's name in french */
    name__fr: string;
    /** The preset's name */
    description: string;
    /** The preset's name in french */
    description__fr: string;
    /** The models of the model */
    models: Model[];
    constructor(object?: IPreset);
    fromObject(object: IPreset): Preset;
    toObject(): IPreset;
}
