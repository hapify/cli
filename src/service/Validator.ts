import { Service } from 'typedi';
import { IValidatorResult, IModel, ValidatorResultSchema } from '../interface';
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
	constructor() {}

	/**
	 * Run validation on a single model for a single channel
	 *
	 * @param {string} content
	 * @param {IModel} model
	 * @return {Promise<IValidatorResult>}
	 */
	async run(content: string, model: IModel): Promise<IValidatorResult> {
		let result;

		// Try or die
		try {
			const final = `(function() { \n${content}\n })()`;
			result = new SaferEval(
				{ model },
				{
					filename: 'js-validator.js',
					timeout: ConfigInternal.validatorTimeout,
					lineOffset: -1,
					contextCodeGeneration: {
						strings: false,
						wasm: false
					}
				}
			).runInContext(final);
		} catch (error) {
			if (error.message === 'Script execution timed out.') {
				throw new RichError(
					`Template processing timed out (${
						ConfigInternal.validatorTimeout
					}ms)`,
					{
						code: 4006,
						type: 'CliValidatorTimeoutError'
					}
				);
			}
			// Format error
			const { lineNumber, columnNumber } = ErrorStackParser.parse(
				error
			)[0];
			throw new RichError(error.message, {
				code: 4005,
				type: 'CliValidatorEvaluationError',
				details: `Error: ${
					error.message
				}. Line: ${lineNumber}, Column: ${columnNumber}`,
				lineNumber,
				columnNumber
			});
		}

		// Check result and return
		const validation = Joi.validate(result, ValidatorResultSchema);
		if (validation.error) {
			throw new RichError(
				`Invalid validator output. Must return { errors: string[], warnings: string[] }`,
				{
					code: 4007,
					type: 'CliValidatorOutputError'
				}
			);
		}
		return result;
	}
}
