import { IGenerator } from '../../interface';
import { Template } from '../../class';
import { Service } from 'typedi';

@Service()
export class JavaScriptGeneratorService implements IGenerator {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * @inheritDoc
   */
  async one(model: any, template: Template): Promise<string> {

    // Eval template content
    const m = model;
    return eval(template.content);
  }

  /**
   * @inheritDoc
   */
  async all(models: any[], template: Template): Promise<string> {

    // Create template function
    const m = models;
    return eval(template.content);
  }
}
