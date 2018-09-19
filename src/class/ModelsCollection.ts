import * as Fs from 'fs';
import * as Path from 'path';
import { IModel, IStorable, ISerilizable } from '../interface';
import { Model, Channel } from './';

export class ModelsCollection implements IStorable, ISerilizable<IModel[], Model[]> {

  /** @type {Model[]} The list of model instances */
  private models: Model[];
  /** @type {Model[]} The full path to the file */
  public modelsPath: string;

  /**
   * Constructor
   * @param {Channel} parent
   * @param {string} path
   */
  constructor(private parent: Channel, public path: string) {
    this.modelsPath = Path.join(this.parent.path, this.path);
  }

  /** @inheritDoc */
  public async load(): Promise<void> {
    const models: IModel[] = JSON.parse(<string>Fs.readFileSync(this.modelsPath, 'utf8'));
    this.fromObject(models);
  }
  /** @inheritDoc */
  async save(): Promise<void> {
    const data = JSON.stringify(this.toObject(), null, 2);
    Fs.writeFileSync(this.modelsPath, data, 'utf8');
  }
  /**
   * Find a instance with its id
   * @param {string} id
   * @returns {Promise<Model|null>}
   */
  async find(id: string): Promise<Model|null> {
    return this.models.find((instance) => instance.id === id);
  }
  /**
   * Returns the list of models
   * @returns {Promise<Model[]>}
   */
  async list(): Promise<Model[]> {
    return this.models;
  }
  /** @inheritDoc */
  public fromObject(object: IModel[]): Model[] {
    this.models = object.map((model: IModel): Model => {
      const m = new Model();
      return m.fromObject(model);
    });
    return this.models;
  }
  /** @inheritDoc */
  public toObject(): IModel[] {
    return this.models.map((model: Model): IModel => model.toObject());
  }
}
