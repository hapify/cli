'use strict';

const {
    ConstructorError,
    ArgumentsError,
    EvaluationError
} = require('./errors');
const Patterns = require('./patterns');
const SafeEval = require('safe-eval');

/** @type {BasePattern[]} Ordered patterns */
const PatternsStack = [
    Patterns.Comment,
    Patterns.NameInterpolation,
    Patterns.Interpolation,
    Patterns.Conditional,
    Patterns.Iteration,
    Patterns.Evaluate,
    Patterns.Escape,
];

/** @type {HapifySyntax} Syntax parser */
module.exports = class HapifySyntax {

    /** Constructor */
    constructor() {
        throw new ConstructorError('[HapifySyntax] Cannot be instanced');
    }

    /**
     * Parser method
     * @param {string} template
     * @param {{}} model
     * @return {string}
     */
    static run(template, model) {

        // Check how many arguments
        if (arguments.length !== 2) {
            throw new ArgumentsError('[HapifySyntax.run] Requires two arguments');
        }
        
        // Check arguments
        if (typeof template !== 'string') {
            throw new ArgumentsError('[HapifySyntax.run] template must be a string');
        }
        if (typeof model !== 'object') {
            throw new ArgumentsError('[HapifySyntax.run] model must be an object');
        }
        if (model === null) {
            throw new ArgumentsError('[HapifySyntax.run] model cannot be null');
        }
        
        // Escape quotes
        let output = HapifySyntax._escape(template);
        
        // Execute all patterns
        for (const pattern of PatternsStack) {
            output = pattern.execute(output, model);
        }
        
        return HapifySyntax._eval(output, model);
    }

    /**
     * Escape quotes
     * @param {string} template
     * @private
     */
    static _escape(template) {
        return template.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    }

    /**
     * Eval the generated script
     * @param {string} template
     * @param {{}|{}[]} root
     * @private
     */
    static _eval(template, root) { // eslint-disable-line no-unused-vars
        const final = `(function() {let out = \`${template}\`; return out;})()`;

        try {
            return SafeEval(final, { root });
        }
        catch (error) {
            HapifySyntax._log(`[HapifySyntax._eval] An error occurred during evaluation\n\n${error}\n\n${final}`);
            throw new EvaluationError(error.message);
        }
    }

    /**
     * Log something
     * @private
     */
    static _log(/* arguments */) {
        // console.log(...arguments); // eslint-disable-line no-console
    }

};
