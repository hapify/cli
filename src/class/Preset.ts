import { IPreset, IModel, ISerilizable } from '../interface';
import { Model } from './';

export class Preset implements ISerilizable<IPreset, Preset>, IPreset {

  /** @type {string} The model's unique id */
  id: string;
  /** @type {string} The preset icon */
  icon: string;
  /** @type {string} The preset's name */
  name: string;
  /** @type {string} The preset's name in french */
  name__fr: string;
  /** @type {string} The preset's name */
  description: string;
  /** @type {string} The preset's name in french */
  description__fr: string;
  /** @type {Model[]} The models of the model */
  models: Model[];

  /** Constructor */
  constructor() {
  }

  /** @inheritDoc */
  public fromObject(object: IPreset): Preset {
    this.id = object.id;
    this.icon = object.icon;
    this.name = object.name;
    this.name__fr = object.name__fr;
    this.description = object.description;
    this.description__fr = object.description__fr;
    this.models = object.models.map((modelBase: IModel): Model => {
      const model = new Model();
      return model.fromObject(modelBase);
    });
    return this;
  }

  /** @inheritDoc */
  public toObject(): IPreset {
    return {
      id: this.id,
      icon: this.icon,
      name: this.name,
      name__fr: this.name__fr,
      description: this.description,
      description__fr: this.description__fr,
      models: this.models.map((model: Model): IModel => model.toObject()),
    };
  }
}
