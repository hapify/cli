import { IModel, IField } from '../interface';
import { Field } from './';

export class Model implements IModel {

  /** @type {string} The model's unique id */
  id: string;
  /** @type {string} The model's name */
  name: string;
  /** @type {Field[]} The fields of the model */
  fields: Field[];

  /** Constructor */
  constructor() {}

  /**
   * Bind properties from the base object to this object
   * @param {IModel} object
   * @returns {Model}
   *  Returns this
   */
  public fromObject(object: IModel): Model {
    this.id = object.id;
    this.name = object.name;
    this.fields = object.fields.map((fieldBase: IField): Field => {
      const field = new Field();
      return field.fromObject(fieldBase);
    });
    return this;
  }
  /**
   * Convert the instance to an object
   * @returns {IModel}
   */
  public toObject(): IModel {
    return {
      id: this.id,
      name: this.name,
      fields: this.fields.map((field: Field): IField => field.toObject())
    };
  }
}
