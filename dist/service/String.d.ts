import { IStringVariants } from '../interface/Generator';
export declare class StringService {
    constructor();
    /** Returns the string with all formats */
    variants(value: string): IStringVariants;
    /** Returns the variants names */
    types(): (keyof IStringVariants)[];
}
