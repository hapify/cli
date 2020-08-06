import { IGeneratorResult } from '../interface/Generator';
export declare class WriterService {
    constructor();
    /** Zip results and write to disk */
    zip(path: string, results: IGeneratorResult[]): Promise<void>;
    /** Write results to disk */
    writeMany(root: string, results: IGeneratorResult[]): Promise<void>;
    /** Write on result to disk */
    write(root: string, result: IGeneratorResult): Promise<void>;
}
