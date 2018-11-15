
export interface IFormattedSentences {
  /** @type {string} The sentence as Original */
  raw: string;
  /** @type {string} The sentence as SlugHyphen */
  hyphen: string;
  /** @type {string} The sentence as SlugHyphenUpperCase */
  hyphenUpper: string;
  /** @type {string} The sentence as SlugUnderscore */
  underscore: string;
  /** @type {string} The sentence as SlugUnderscoreUpperCase */
  underscoreUpper: string;
  /** @type {string} The sentence as SlugOneWord */
  oneWord: string;
  /** @type {string} The sentence as WordsUpperCase */
  wordsUpper: string;
  /** @type {string} The sentence as WordsLowerCase */
  wordsLower: string;
  /** @type {string} The sentence as UpperCamelCase */
  upperCamel: string;
  /** @type {string} The sentence as LowerCamelCase */
  lowerCamel: string;
}
