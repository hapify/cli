'use strict';

const BasePattern = require('./base');

/** @type {RegExp} Evaluation pattern */
const RegEx = /<<<([\s\S]+?)>>>/g;

/** @type {EvaluatePattern} Evaluate pattern */
module.exports = class EvaluatePattern extends BasePattern {

    /**
     * Parser method
     * @param {string} template
     * @return {string}
     */
    static execute(template) {
        return template.replace(RegEx, (match, _code) => EvaluatePattern._dynamic(EvaluatePattern._unescape(_code)));
    }

};
