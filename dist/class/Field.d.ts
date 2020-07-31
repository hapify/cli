import { IField, ISerializable } from '../interface';
export declare class Field implements ISerializable<IField, Field> {
    /** @type {string} The field's name */
    name: string;
    /** @type {string} The field's notes */
    notes?: string;
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
    /** @type {boolean} Indicate whether the field is embedded (should be always exposed explicitly) */
    embedded: boolean;
    /** @type {boolean} Indicate whether the field is searchable or not */
    searchable: boolean;
    /** @type {boolean} Indicate whether the field is sortable or not */
    sortable: boolean;
    /** @type {boolean} Indicate whether the field is private (should not be exposed) */
    hidden: boolean;
    /** @type {boolean} Indicate whether the field is for an internal use only (should not be defined by an user) */
    internal: boolean;
    /** @type {boolean} Indicate whether the field is restricted to authorized roles (should only be defined by an admin) */
    restricted: boolean;
    /** @type {boolean} Indicate that this field defines the owner of the entity */
    ownership: boolean;
    /** Constructor */
    constructor(object?: IField);
    /** @inheritDoc */
    fromObject(object: IField): Field;
    /** @inheritDoc */
    toObject(): IField;
}
