import { IGenerator } from '../interface';
import { Template } from '../class';
import { Service } from 'typedi';
import doT from 'dot';

@Service()
export class DotGeneratorService implements IGenerator {

  /**
   * Constructor
   */
  constructor() {
    doT.templateSettings.strip = false;
  }

  /**
   * @inheritDoc
   */
  async one(model: any, template: Template): Promise<string> {

    // Create template function
    const templateFunction = doT.template(template.content);
    const content = templateFunction({model, m: model, o: '{{', c: '}}'});
    return await this._postProcess(content);
  }

  /**
   * @inheritDoc
   */
  async all(models: any[], template: Template): Promise<string> {

    // Create template function
    const templateFunction = doT.template(template.content);
    const content = templateFunction({models, m: models, o: '{{', c: '}}'});
    return await this._postProcess(content);
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
