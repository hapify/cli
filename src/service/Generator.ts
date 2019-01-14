import { Container, Service } from 'typedi';
import { IGeneratorResult } from '../interface';
import { Template, Model, Channel } from '../class';
import { ApiService } from './Api';

@Service()
export class GeneratorService {

  /** Service to call remote API */
  private apiService: ApiService;

  /** Constructor */
  constructor() {
  }

  /** Load and returns API Service. Avoid circular dependency */
  api() {
    if (typeof this.apiService === 'undefined') {
      this.apiService = Container.get(ApiService);
    }
    return this.apiService;
  }

  /**
   * Compile for a whole channel
   * @param {Channel} channel
   * @returns {Promise<IGeneratorResult[]>}
   */
  async runChannel(channel: Channel): Promise<IGeneratorResult[]> {
    const response = await this.api().post('generator/run', {
      project: channel.config.project,
      templates: channel.templates.map(t => t.toObject())
    });
    return response.data;
  }

  /**
   * Compile a template to multiple files.
   * One per model, if applicable.
   *
   * @param {Template} template
   * @returns {Promise<IGeneratorResult[]>}
   */
  async runTemplate(template: Template): Promise<IGeneratorResult[]> {
    const response = await this.api().post('generator/run', {
      project: template.channel().config.project,
      templates: [template.toObject()]
    });
    return response.data;
  }

  /**
   * Run generation process for one model
   *
   * @param {Template} template
   * @param {Model|null} model
   * @returns {Promise<IGeneratorResult>}
   * @throws {Error}
   *  If the template needs a model and no model is passed
   */
  async run(template: Template, model: Model | null): Promise<IGeneratorResult> {

    if (template.needsModel() && !model) {
      throw new Error('Model should be defined for this template');
    }

    const payload: any = {
      project: template.channel().config.project,
      templates: [template.toObject()]
    };

    if (model) {
      payload.ids = [model.id];
    }

    return (await this.api().post('generator/run', payload)).data[0];
  }

  /**
   * Compute path from a string
   *
   * @param {string} path
   * @param {Model|null} model
   *  Default null
   * @returns {string}
   */
  async pathPreview(path: string, model: Model | null = null): Promise<string> {
    const payload = model ? {path, model: model.id} : {path};
    return (await this.api().post('generator/path', payload)).data.result;
  }

}
