import { Validator } from '../interface/Validator';
import { IModel } from '../interface/Generator';
export declare class ValidatorService {
    constructor();
    /**
     * Run validation on a single model for a single channel
     *
     */
    run(content: string, model: IModel): Promise<Validator>;
}
