'use strict';

const BasePattern = require('./base');

/** @type {{}} Start pattern and replacer */
const Start = {
    find: /\\<\\</g,
    replace: '<<'
};
/** @type {{}} end pattern and replacer */
const End = {
    find: /\\>\\>/g,
    replace: '>>'
};

/** @type {EscapePattern} Escape pattern */
module.exports = class EscapePattern extends BasePattern {

    /**
     * Parser method
     * @param {string} template
     * @return {string}
     */
    static execute(template) {
        return template
            .replace(Start.find, Start.replace)
            .replace(End.find, End.replace);
    }

};
