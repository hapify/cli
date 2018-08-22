import { IField } from '../interface';
import { FieldType } from './FieldType';

export class Field implements IField {

  /** @type {string} The field's name */
  name: string;
  /** @type {string} The field's type */
  type: string;
  /** @type {string} The field's subtype */
  subtype: string | null;
  /** @type {string} The field's reference if the type is entity. The GUID string of the targeted model */
  reference: string;
  /** @type {boolean} Should be used as a primary key or not */
  primary: boolean;
  /** @type {boolean} Should be used as a unique key or not */
  unique: boolean;
  /** @type {boolean} Should be used as a label or not */
  label: boolean;
  /** @type {boolean} Denotes if the field can be empty or not */
  nullable: boolean;
  /** @type {boolean} Denotes if the field is an array of values */
  multiple: boolean;
  /** @type {boolean} Indicate whether the field is searchable or not */
  searchable: boolean;
  /** @type {boolean} Indicate whether the field is sortable or not */
  sortable: boolean;
  /** @type {boolean} Indicate whether the field is private (should not be exposed) */
  isPrivate: boolean;
  /** @type {boolean} Indicate whether the field is for an internal use only (should not be defined by an user) */
  internal: boolean;
  /** @type {boolean} Indicate whether the field is important (should be always exposed explicitly) */
  important: boolean;

  /** Constructor */
  constructor() {}

  /**
   * Bind properties from the base object to this object
   * @param {IField} object
   * @returns {Field}
   *  Returns this
   */
  public fromObject(object: IField): Field {
    this.name = object.name;
    this.type = object.type;
    this.subtype = object.subtype;
    this.reference = object.reference;
    this.primary = !!<any>object.primary;
    this.unique = !!<any>object.unique;
    this.label = !!<any>object.label;
    this.nullable = !!<any>object.nullable;
    this.multiple = !!<any>object.multiple;
    this.searchable = !!<any>object.searchable;
    this.sortable = !!<any>object.sortable;
    this.isPrivate = !!<any>object.isPrivate;
    this.internal = !!<any>object.internal;
    this.important = !!<any>object.important;
    return this;
  }
  /**
   * Convert the instance to an object
   * @returns {IField}
   */
  public toObject(): IField {
    return {
      name: this.name,
      type: this.type,
      subtype: this.subtype,
      reference: this.type === FieldType.Entity ? this.reference : null,
      primary: this.primary,
      unique: this.unique,
      label: this.label,
      nullable: this.nullable,
      multiple: this.multiple,
      searchable: this.searchable,
      sortable: this.sortable,
      isPrivate: this.isPrivate,
      internal: this.internal,
      important: this.important
    };
  }
}
