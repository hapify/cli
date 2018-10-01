// Type definitions for Hapify Syntax

export = HapifySyntax;

/**
 * Declare the class
 */
declare class HapifySyntax {
    /**
     * Run the code generation for this template's content and this explicit model
     *
     * @param {string} template
     * @param {any} model
     * @return {string}
     */
    static run(template: string, model: any): string;
}
