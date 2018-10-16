import { IModel, IField, ISerilizable, Context, IContexts } from '../interface';
import { Field } from './';

export class Model implements ISerilizable<IModel, Model>, IModel {

  /** @type {string} The model's unique id */
  id: string;
  /** @type {string} The model's name */
  name: string;
  /** @type {Field[]} The fields of the model */
  fields: Field[];
  /** @type IContexts The model privacy context */
  public contexts: IContexts = {
    create: Context.GUEST,
    read: Context.GUEST,
    update: Context.GUEST,
    remove: Context.GUEST,
    search: Context.GUEST,
    count: Context.GUEST,
  };

  /** Constructor */
  constructor() {}

  /** @inheritDoc */
  public fromObject(object: IModel): Model {
    this.id = object.id;
    this.name = object.name;
    this.fields = object.fields.map((fieldBase: IField): Field => {
      const field = new Field();
      return field.fromObject(fieldBase);
    });
    if (object.contexts) {
      this.contexts = object.contexts;
    }
    return this;
  }
  /** @inheritDoc */
  public toObject(): IModel {
    return {
      id: this.id,
      name: this.name,
      fields: this.fields.map((field: Field): IField => field.toObject()),
      contexts: this.contexts
    };
  }
}
