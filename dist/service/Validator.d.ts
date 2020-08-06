import { Validator } from '../interface/Validator';
import { IModel } from '../interface/Generator';
export declare class ValidatorService {
    /**
     * Constructor
     */
    constructor();
    /**
     * Run validation on a single model for a single channel
     *
     * @param {string} content
     * @param {IModel} model
     * @return {Promise<Validator>}
     */
    run(content: string, model: IModel): Promise<Validator>;
}
