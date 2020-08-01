import { Service } from 'typedi';

import * as Case from 'case';
import { IStringVariants } from '../interface/IStringVariants';

@Service()
export class StringService {
	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Returns the string with all formats
	 *
	 * @param {string} value
	 * @returns {string}
	 */
	public variants(value: string): IStringVariants {
		return {
			raw: value,
			kebab: Case.kebab(value),
			snake: Case.snake(value),
			header: Case.header(value),
			constant: Case.constant(value),
			big: Case.constant(value).replace(/_/g, '-'),
			capital: Case.capital(value),
			lower: Case.lower(value),
			upper: Case.upper(value),
			compact: Case.snake(value).replace(/_/g, ''),
			pascal: Case.pascal(value),
			camel: Case.camel(value),
		};
	}
}
