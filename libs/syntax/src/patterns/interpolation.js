'use strict';

const BasePattern = require('./base');

/** @type {RegExp} Interpolation pattern */
const RegEx = /<<=([\s\S]+?)>>/g;

/** @type {InterpolationPattern} Interpolation pattern */
module.exports = class InterpolationPattern extends BasePattern {

    /**
     * Parser method
     * @param {string} template
     * @return {string}
     */
    static execute(template) {
        return template.replace(RegEx, (match, _code) => InterpolationPattern._dynamic(`out += ${InterpolationPattern._unescape(_code)};`));
    }

};
