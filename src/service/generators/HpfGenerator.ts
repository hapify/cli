import { IGenerator } from '../../interface';
import { Template } from '../../class';
import { Service } from 'typedi';
import { HapifySyntax } from '../../../packages/hapify-syntax';

@Service()
export class HpfGeneratorService implements IGenerator {

    /**
     * Constructor
     */
    constructor() {}

    /**
     * @inheritDoc
     */
    async one(model: any, template: Template): Promise<string> {

        // Create template function
        const cleanedContent = await this._preProcess(template.content);
        const content = HapifySyntax.run(cleanedContent, model);
        return await this._postProcess(content);
    }

    /**
     * @inheritDoc
     */
    async all(models: any[], template: Template): Promise<string> {

        // Create template function
        const cleanedContent = await this._preProcess(template.content);
        const content = HapifySyntax.run(cleanedContent, models);
        return await this._postProcess(content);
    }

    /**
     * Cleanup code before process
     *
     * @param {string} template
     * @return {Promise<string>}
     * @private
     */
    private async _preProcess(template: string) {
        const indentConditions = /^ +<<(\?|@|#)([\s\S]*?)>>/gm;
        return template.replace(indentConditions, '<<$1$2>>');
    }

    /**
     * Cleanup code after process
     *
     * @param {string} code
     * @return {Promise<string>}
     * @private
     */
    private async _postProcess(code: string) {

        const doubleLine = /\r?\n\r?\n/g;
        while (code.match(doubleLine)) {
            code = code.replace(doubleLine, '\n');
        }

        const doubleLineWithSpace = /\r?\n *\r?\n/g;
        code = code.replace(doubleLineWithSpace, '\n\n');
        code = code.replace(doubleLineWithSpace, '\n\n');

        return code;
    }
}
