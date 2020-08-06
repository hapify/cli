import { ISerializable } from '../interface/Storage';
import { FieldSubType, FieldType, IField } from '../interface/Generator';
export declare class Field implements ISerializable<IField, Field> {
    /** The field's name */
    name: string;
    /** The field's notes */
    notes?: string;
    /** The field's type */
    type: FieldType;
    /** The field's subtype */
    subtype: FieldSubType | null;
    /** The field's reference if the type is entity. The GUID string of the targeted model */
    reference: string;
    /** Should be used as a primary key or not */
    primary: boolean;
    /** Should be used as a unique key or not */
    unique: boolean;
    /** Should be used as a label or not */
    label: boolean;
    /** Denotes if the field can be empty or not */
    nullable: boolean;
    /** Denotes if the field is an array of values */
    multiple: boolean;
    /** Indicate whether the field is embedded (should be always exposed explicitly) */
    embedded: boolean;
    /** Indicate whether the field is searchable or not */
    searchable: boolean;
    /** Indicate whether the field is sortable or not */
    sortable: boolean;
    /** Indicate whether the field is private (should not be exposed) */
    hidden: boolean;
    /** Indicate whether the field is for an internal use only (should not be defined by an user) */
    internal: boolean;
    /** Indicate whether the field is restricted to authorized roles (should only be defined by an admin) */
    restricted: boolean;
    /** Indicate that this field defines the owner of the entity */
    ownership: boolean;
    constructor(object?: IField);
    fromObject(object: IField): Field;
    toObject(): IField;
}
