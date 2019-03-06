export interface IFormattedSentences {
	/** @type {string} The sentence as Original */
	raw: string;
	/** @type {string} The sentence as SlugHyphen */
	kebab: string;
	/** @type {string} The sentence as SlugHyphenUpperCase */
	big: string;
	/** @type {string} The sentence as SlugUnderscore */
	underscore: string;
	/** @type {string} The sentence as SlugUnderscoreUpperCase */
	constant: string;
	/** @type {string} The sentence as SlugOneWord */
	compact: string;
	/** @type {string} The sentence as WordsUpperCase */
	capital: string;
	/** @type {string} The sentence as WordsLowerCase */
	lower: string;
	/** @type {string} The sentence as UpperCamelCase */
	pascal: string;
	/** @type {string} The sentence as LowerCamelCase */
	camel: string;
}
