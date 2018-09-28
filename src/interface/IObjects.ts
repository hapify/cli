

export interface IConfigTemplate {
  /** @type {string} The template's name */
  name: string;
  /** @type {string} The template's path */
  path: string;
  /** @type {string} The template's type */
  engine: string;
  /** @type {string} Denotes if the template has to to be ran for one or all models */
  input: string;
}

export interface IConfig {
  /** @type {string} The channel's validation script path */
  validatorPath: string;
  /** @type {string} The path to the models' file */
  modelsPath: string;
  /** @type {IConfigTemplate[]} The templates of the channel */
  templates: IConfigTemplate[];
}

export interface IField {
  /** @type {string} The field's name */
  name: string;
  /** @type {string} The field's type */
  type: string;
  /** @type {string} The field's subtype */
  subtype: string | null;
  /** @type {string} The field's reference if the type is entity. The GUID string of the targeted model */
  reference: string | null;
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
}

export interface IModel {
  /** @type {string} The model's unique id */
  id: string;
  /** @type {string} The model's name */
  name: string;
  /** @type {IField[]} The fields of the model */
  fields: IField[];
}

export interface ITemplate extends IConfigTemplate {
  /** @type {string} The template's content */
  content: string;
}

export interface IChannel {
  /** @type {string} The channel's unique id */
  id: string;
  /** @type {string} The channel's name */
  name: string;
  /** @type {ITemplate[]} The templates of the channel */
  templates: ITemplate[];
  /** @type {string} The channel's validation script */
  validator: string;
}
