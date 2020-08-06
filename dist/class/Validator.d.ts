import { IStorable } from '../interface/Storage';
import { Channel } from './Channel';
export declare class Validator implements IStorable {
    private parent;
    path: string;
    /** @type {string} The validator's script content */
    content: string;
    /** Validator storage */
    private storageService;
    /**
     * Constructor
     * @param {Channel} parent
     * @param {string} path
     */
    constructor(parent: Channel, path: string);
    /** @inheritDoc */
    load(): Promise<void>;
    /** @inheritDoc */
    save(): Promise<void>;
    /**
     * Check resource validity
     * @throws {Error}
     */
    private validate;
    /**
     * Denotes if the validator should be considered as empty
     * @returns {boolean}
     */
    isEmpty(): boolean;
}
