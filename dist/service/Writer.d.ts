import { IGeneratorResult } from '../interface/IGeneratorResult';
export declare class WriterService {
    /** Constructor */
    constructor();
    /**
     * Zip results and write to disk
     * @param {string} path
     * @param {IGeneratorResult[]} results
     * @return {Promise<void>}
     */
    zip(path: string, results: IGeneratorResult[]): Promise<void>;
    /**
     * Write results to disk
     * @param {string} root
     * @param {IGeneratorResult[]} results
     * @return {Promise<void>}
     */
    writeMany(root: string, results: IGeneratorResult[]): Promise<void>;
    /**
     * Write on result to disk
     * @param {string} root
     * @param {IGeneratorResult} result
     * @return {Promise<void>}
     */
    write(root: string, result: IGeneratorResult): Promise<void>;
}
