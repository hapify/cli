import { Template } from '../class';

export interface IGenerator {

  /**
   * Run generation process for one model
   * @param {any} model
   * @param {Template} template
   * @returns {Promise<string>}
   */
  one(model: any, template: Template): Promise<string>;

  /**
   * Run generation process for one model
   * @param {any[]} models
   *  All models in the project
   * @param {Template} template
   * @returns {Promise<string>}
   */
  all(models: any[], template: Template): Promise<string>;
}

