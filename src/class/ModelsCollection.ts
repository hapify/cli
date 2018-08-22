import * as Fs from 'fs';
import { IModel, IStorable } from '../interface';
import { Model, Channel } from './';

export class ModelsCollection implements IStorable {

  /** @type {Model[]} The list of model instances */
  public models: Model[];

  /**
   * Constructor
   * @param {Channel} parent
   * @param {string} path
   */
  constructor(private parent: Channel, public path: string) {
  }

  /** @inheritDoc */
  public async load(): Promise<void> {
    const modelsPath = `${this.parent.path}/${this.path}`;
    const models: IModel[] = JSON.parse(<string>Fs.readFileSync(modelsPath, 'utf8'));
    this.models = models.map((model: IModel): Model => {
      const m = new Model();
      return m.fromObject(model);
    });
  }
  /** @inheritDoc */
  async save(): Promise<void> {
    const modelsPath = `${this.parent.path}/${this.path}`;
    const models = this.models.map((model: Model): IModel => model.toObject());
    const data = JSON.stringify(models, null, 2);
    Fs.writeFileSync(modelsPath, data, 'utf8');
  }
}
