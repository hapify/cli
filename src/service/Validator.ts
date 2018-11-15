import { Service } from 'typedi';
import { IValidatorResult, IModel } from '../interface';
import { Channel } from '../class';
const SafeEval = require('safe-eval');

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

    // No script, no error
    if (typeof script === 'undefined' || script.length === 0) {
      return {
        errors: [],
        warnings: []
      };
    }

    const result = <IValidatorResult>SafeEval(`(function() { ${script} })()`, { model: model });

    if (!(result && result.errors instanceof Array && result.warnings instanceof Array)) {
      throw new Error('Invalid validator return. Must returns { errors: string[], warnings: string[] }');
    }

    return result;
  }

  /**
   * Run validation on a single model for a single channel
   *
   * @param {Channel} channel
   * @param {IModel} model
   * @return {Promise<IValidatorResult>}
   */
  async runForChannel(channel: Channel, model: IModel): Promise<IValidatorResult> {
    return this.run(channel.validator.content, model);
  }
}
