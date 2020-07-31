import { IValidatorResult, IModel } from '../interface';
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
     * @return {Promise<IValidatorResult>}
     */
    run(content: string, model: IModel): Promise<IValidatorResult>;
}
