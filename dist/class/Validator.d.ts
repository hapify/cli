import { IStorable } from '../interface/Storage';
import { Channel } from './Channel';
export declare class Validator implements IStorable {
    private parent;
    path: string;
    /** The validator's script content */
    content: string;
    /** Validator storage */
    private storageService;
    constructor(parent: Channel, path: string);
    load(): Promise<void>;
    save(): Promise<void>;
    /** Check resource validity */
    private validate;
    /** Denotes if the validator should be considered as empty */
    isEmpty(): boolean;
}
