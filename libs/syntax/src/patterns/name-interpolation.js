'use strict';

const BasePattern = require('./base');
const { ParsingError } = require('../errors');

/** @type {RegExp} Name interpolation pattern */
const RegEx = /<<([a-zA-Z_.]+)\s+([aA_\-R]+)\s*>>/g;

/** @type {NameInterpolationPattern} NameInterpolation pattern */
module.exports = class NameInterpolationPattern extends BasePattern {

    /**
     * Parser method
     * @param {string} template
     * @return {string}
     */
    static execute(template) {
        
        return template.replace(RegEx, (match, _variable, _property) => {
            
            // Get the var
            let variable = _variable;
            if (variable === 'M') variable = 'root';
            else if (variable === 'P') variable = 'root.fields.primary';
            
            // Get the property
            let property = _property;
            if (property === 'aA') property = 'lowerCamel';
            else if (property === 'AA') property = 'upperCamel';
            else if (property === 'a') property = 'wordsLower';
            else if (property === 'A') property = 'wordsUpper';
            else if (property === 'a-a') property = 'hyphen';
            else if (property === 'A-A') property = 'hyphenUpper';
            else if (property === 'a_a') property = 'underscore';
            else if (property === 'A_A') property = 'underscoreUpper';
            else if (property === 'aa') property = 'oneWord';
            else if (property === 'R') property = 'raw';
            else throw new ParsingError(`[NameInterpolationPattern.execute] Unknown name property: ${property}`);
            
            return `\${${variable}.names.${property}}`;
        });
    }

};
