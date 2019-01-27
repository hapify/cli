import { Service } from 'typedi';
import { IValidatorResult, IModel, ValidatorResultSchema, TransformValidationMessage } from '../interface';
import { ConfigInternal } from '../config';
import * as ErrorStackParser from 'error-stack-parser';
import { RichError } from '../class';
const { SaferEval } = require('safer-eval');
import * as Joi from 'joi';

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
   * @param {string} content
   * @param {IModel} model
   * @return {Promise<IValidatorResult>}
   */
  async run(content: string, model: IModel): Promise<IValidatorResult> {
    try {
      const final = `(function() { \n${content}\n })()`;
      const result = new SaferEval({ model }, {
        filename: 'js-validator.js',
        timeout: ConfigInternal.validatorTimeout,
        lineOffset: -1,
        contextCodeGeneration: {
          strings: false,
          wasm: false,
        }
      }).runInContext(final);

      const validation = Joi.validate(result, ValidatorResultSchema);
      if (validation.error) {
        const original = TransformValidationMessage(validation.error).message;
        throw new RichError(
          `Invalid validator output. Must return { errors: string[], warnings: string[] } [${original}]`,
          {
            code: 4007,
            type: 'ConsoleValidatorOutputError'
          }
        );
      }
    } catch (error) {
      if  (error.message === 'Script execution timed out.') {
        throw new RichError(`Template processing timed out (${ConfigInternal.validatorTimeout}ms)`, {
          code: 4006,
          type: 'ConsoleValidatorTimeoutError'
        });
      }
      // Format error
      const { lineNumber, columnNumber } = ErrorStackParser.parse(error)[0];
      throw new RichError(error.message, {
        code: 4005,
        type: 'ConsoleValidatorEvaluationError',
        details: `Error: ${error.message}. Line: ${lineNumber}, Column: ${columnNumber}`,
        lineNumber,
        columnNumber
      });
    }
  }

}
