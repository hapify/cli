/**
 * Represent a class that can be loaded and saved
 */
export interface IStorable {
    /** @return {Promise<void>} */
    load(): Promise<void>;
    /** @return {Promise<void>} */
    save(): Promise<void>;
}
