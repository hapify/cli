import { Service } from 'typedi';
import { IValidatorResult, IModel } from '../interface';

@Service()
export class ValidatorService {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Run validation on a single model for a single channel
   *
   * @param {string} script
   * @param {IModel} model
   * @return {Promise<IValidatorResult>}
   */
  async run(script: string, model: IModel): Promise<IValidatorResult> {
    /** @todo To be implemented */
    return {
      errors: [],
      warnings: []
    };
  }

}
