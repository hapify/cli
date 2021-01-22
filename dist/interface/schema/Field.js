"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const FieldTypes = ['boolean', 'number', 'string', 'enum', 'datetime', 'entity', 'object', 'file'];
const FieldSubTypes = [
    'integer',
    'float',
    'latitude',
    'longitude',
    'email',
    'password',
    'url',
    'text',
    'rich',
    'date',
    'time',
    'image',
    'video',
    'audio',
    'document',
];
exports.FieldSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    notes: joi_1.default.string().allow(null),
    type: joi_1.default.string()
        .valid(...FieldTypes)
        .required(),
    subtype: joi_1.default.string()
        .valid(...FieldSubTypes)
        .allow(null)
        .required(),
    value: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.array().items(joi_1.default.string())).required().allow(null),
    primary: joi_1.default.boolean().required(),
    unique: joi_1.default.boolean().required(),
    label: joi_1.default.boolean().required(),
    nullable: joi_1.default.boolean().required(),
    multiple: joi_1.default.boolean().required(),
    embedded: joi_1.default.boolean().required(),
    searchable: joi_1.default.boolean().required(),
    sortable: joi_1.default.boolean().required(),
    hidden: joi_1.default.boolean().required(),
    internal: joi_1.default.boolean().required(),
    restricted: joi_1.default.boolean().required(),
    ownership: joi_1.default.boolean().required(),
});
//# sourceMappingURL=Field.js.map