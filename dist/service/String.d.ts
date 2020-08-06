import { IStringVariants } from '../interface/Generator';
export declare class StringService {
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns the string with all formats
     *
     * @param {string} value
     * @returns {string}
     */
    variants(value: string): IStringVariants;
}
