import { IModel, IField, ISerilizable } from '../interface';
import { Field } from './';

export class Model implements IModel, ISerilizable<IModel, Model> {

  /** @type {string} The model's unique id */
  id: string;
  /** @type {string} The model's name */
  name: string;
  /** @type {Field[]} The fields of the model */
  fields: Field[];

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
    return this;
  }
  /** @inheritDoc */
  public toObject(): IModel {
    return {
      id: this.id,
      name: this.name,
      fields: this.fields.map((field: Field): IField => field.toObject())
    };
  }
}
