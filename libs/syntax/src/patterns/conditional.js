'use strict';
/* eslint-disable object-curly-newline */
/* eslint-disable object-property-newline */

const BasePattern = require('./base');

const { InternalError } = require('../errors');

/** @type {RegExp} if () { pattern */
const IfPattern = /<<\?(\d)?\s+([a-zA-Z_.]+)(\s+[a-zA-Z()!+*\-/]+)?\s*>>/g;
/** @type {RegExp} else if () { pattern */
const ElseIfPattern = /<<\?\?(\d)?\s+([a-zA-Z_.]+)(\s+[a-zA-Z()!+*\-/]+)?\s*>>/g;
/** @type {RegExp} else pattern */
const ElsePattern = /<<\?\?>>/g;
/** @type {RegExp} } pattern */
const EndPattern = /<<\?>>/g;
/** @type {[{}]} Conditions short codes & operators */
const Repalcements = [
    
    // Operators
    { search: '*', replace: ' && ', escape: true },
    { search: '/', replace: ' && !', escape: true },
    { search: '+', replace: ' || ', escape: true },
    { search: '-', replace: ' || !', escape: true },
    
    // Fields properties
    { search: 'pr', replace: 'i.primary' },
    { search: 'un', replace: 'i.unique' },
    { search: 'lb', replace: 'i.label' },
    { search: 'nu', replace: 'i.nullable' },
    { search: 'ml', replace: 'i.multiple' },
    { search: 'se', replace: 'i.searchable' },
    { search: 'so', replace: 'i.sortable' },
    { search: 'ip', replace: 'i.isPrivate' },
    { search: 'in', replace: 'i.internal' },
    { search: 'im', replace: 'i.important' },
    
    // Fields types for string
    { search: 'tSe', replace: '(i.type === \'string\' && i.subtype === \'email\')' },
    { search: 'tSp', replace: '(i.type === \'string\' && i.subtype === \'password\')' },
    { search: 'tSt', replace: '(i.type === \'string\' && i.subtype === \'text\')' },
    { search: 'tSr', replace: '(i.type === \'string\' && i.subtype === \'rich\')' },
    { search: 'tS', replace: '(i.type === \'string\')' },

    // Fields types for number
    { search: 'tNi', replace: '(i.type === \'number\' && i.subtype === \'integer\')' },
    { search: 'tNf', replace: '(i.type === \'number\' && i.subtype === \'float\')' },
    { search: 'tNt', replace: '(i.type === \'number\' && i.subtype === \'latitude\')' },
    { search: 'tNg', replace: '(i.type === \'number\' && i.subtype === \'longitude\')' },
    { search: 'tN', replace: '(i.type === \'number\')' },

    // Fields types for boolean
    { search: 'tB', replace: '(i.type === \'boolean\')' },

    // Fields types for datetime
    { search: 'tDd', replace: '(i.type === \'datetime\' && i.subtype === \'date\')' },
    { search: 'tDt', replace: '(i.type === \'datetime\' && i.subtype === \'time\')' },
    { search: 'tD', replace: '(i.type === \'datetime\')' },

    // Fields types for entity
    { search: 'tE', replace: '(i.type === \'entity\')' },
    
    // Models computed properties
    { search: 'pMPr', replace: 'i.properties.mainlyPrivate' },
    { search: 'pMIn', replace: 'i.properties.mainlyInternal' },
    { search: 'pGeo', replace: 'i.properties.isGeolocated' },
    
];
/** @type {Function} Convert replacement search for regexp */
const ForRegExp = (r) => `${r.escape ? '\\' : ''}${r.search}`;
/** @type {RegExp} Dynamic regex for replacements */
const Condition = new RegExp(`(${Repalcements.map(ForRegExp).join('|')})`, 'g');
/** @type {[]} Testers caching */
const Testers = {};

/** @type {ConditionalPattern} Conditional pattern */
module.exports = class ConditionalPattern extends BasePattern {

    /**
     * Parser method
     * @param {string} template
     * @return {string}
     */
    static execute(template) {

        return template
            .replace(IfPattern, (match, _count, _variable, _condition) => {

                // Get the full syntax
                const variable = ConditionalPattern._variable(_variable);
                const tester = ConditionalPattern._tester(_condition);
                const condition = ConditionalPattern._condition(_count, variable, tester);

                return ConditionalPattern._dynamic(`if (${condition}) {`);
            })
            .replace(ElseIfPattern, (match, _count, _variable, _condition) => {

                // Get the full syntax
                const variable = ConditionalPattern._variable(_variable);
                const tester = ConditionalPattern._tester(_condition);
                const condition = ConditionalPattern._condition(_count, variable, tester);

                return ConditionalPattern._dynamic(`} else if (${condition}) {`);
            })
            .replace(ElsePattern, () => ConditionalPattern._dynamic('} else {'))
            .replace(EndPattern, () => ConditionalPattern._dynamic('}'));
    }

    /**
     * Returns the full condition to be injected in the 'if' statement
     * @param {string} _count
     * @param {string} variable
     * @param {string} tester
     * @return {string}
     */
    static _condition(_count, variable, tester) {
        const threshold = typeof _count === 'undefined' ? 0 : _count - 1;
        const arrayTest = `(${variable}.filter && ${variable}.filter${tester}.length > ${threshold})`;
        const objectTest = `(!(${variable}.filter) && ${tester}(${variable}))`;
        
        return `${arrayTest} || ${objectTest}`;
    }

    /**
     * Convert the condition short code to tester method
     * @param {string} _condition
     * @return {string}
     */
    static _tester(_condition) {
        
        // Short exit
        if (typeof _condition === 'undefined') {
            return '((i) => i)';
        }
        
        const trimed = _condition.trim();
        
        if (typeof Testers[trimed] === 'undefined') {

            const condition = trimed
                .replace(Condition, (match) => {
                    const replacement = Repalcements.find((l) => l.search === match);
                    if (!replacement) {
                        throw new InternalError(`[ConditionalPattern._condition] Cannot find condition replacement for ${match}`);
                    }

                    return replacement.replace;
                })
                .trim()
                .replace(/^&&/g, '')
                .replace(/^\|\|/g, '')
                .trim();

            Testers[trimed] = `((i) => ${condition})`;
        }
        
        return Testers[trimed];
    }

    /**
     * Convert the input variable to the real variable
     * @param {string} _variable
     * @return {string}
     */
    static _variable(_variable) {

        let variable = _variable;
        if (variable === 'M') variable = 'root';
        else if (variable === 'F') variable = 'root.fields.list';
        else if (variable === 'D') variable = 'root.dependencies';
        else if (variable === 'R') variable = 'root.referencedIn';
        else if (variable === 'P') variable = 'root.fields.primary';
        
        return variable;
    }

};
