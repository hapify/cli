import { Service } from 'typedi';
import { IValidatorResult, IModel, ValidatorResultSchema } from '../interface';
import { InternalConfig } from '../config';
import { RichError } from '../class';
import { HapifyVM } from '../packages/hapify-vm';
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
		let result: IValidatorResult;

		// Try or die
		try {
			result = new HapifyVM({
				timeout: InternalConfig.validatorTimeout,
				allowAnyOutput: true
			}).run(content, { model });
		} catch (error) {
			if (error.code === 6003) {
				throw new RichError(
					`Template processing timed out (${InternalConfig.validatorTimeout}ms)`,
					{
						code: 4006,
						type: 'CliValidatorTimeoutError'
					}
				);
			}
			if (error.code === 6002) {
				// Clone error
				const { lineNumber, columnNumber } = error;
				throw new RichError(error.message, {
					code: 4005,
					type: 'CliValidatorEvaluationError',
					details: `Error: ${error.message}. Line: ${lineNumber}, Column: ${columnNumber}`,
					lineNumber,
					columnNumber
				});
			}
			if (error.code === 6004) {
				// Clone error
				throw new RichError(error.message, {
					code: error.code,
					type: error.name
				});
			}
			throw error;
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
