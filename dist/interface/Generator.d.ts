import { Access, Accesses, Engine, Field, FieldSubType, FieldType, GeneratorResult, Input, Model, StringVariations, Template } from 'hapify-generator/src/interfaces';
export { Access, Engine, FieldSubType, FieldType, Input };
export interface IStringVariants extends StringVariations {
}
export interface IGeneratorResult extends GeneratorResult {
}
export interface IAccesses extends Accesses {
}
export interface IModel extends Model {
    /** @type {string} The model's notes */
    notes?: string;
    /** The fields of the model */
    fields: IField[];
}
export interface IField extends Field {
    /** @type {string} The field's notes */
    notes?: string;
}
export interface ITemplate extends Template {
}
