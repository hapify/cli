'use strict';

const { ConstructorError } = require('../errors');

/** @type {BasePattern} Abstract base pattern */
module.exports = class BasePattern {

    /** Constructor */
    constructor() {
        throw new ConstructorError('[BasePattern] Cannot be instanced');
    }

    /**
     * Parser method
     * @param {string} template
     * @return {string}
     */
    static execute(template) {
        return template;
    }

    /**
     * Escape string and insert js code
     * @param {string} js
     * @return {string}
     * @private
     */
    static _dynamic(js) {
        return `\`; ${js} out += \``;
    }

    /**
     * Reverse escape quotes `
     * @param {string} code
     * @return {string}
     */
    static _unescape(code) {
        return code.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    }

};
