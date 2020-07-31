"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldSchema = void 0;
const Joi = __importStar(require("joi"));
exports.FieldSchema = Joi.object({
    name: Joi.string().required(),
    notes: Joi.string().allow(null),
    type: Joi.string().required(),
    subtype: Joi.string()
        .required()
        .allow(null),
    reference: Joi.string()
        .required()
        .allow(null),
    primary: Joi.boolean().required(),
    unique: Joi.boolean().required(),
    label: Joi.boolean().required(),
    nullable: Joi.boolean().required(),
    multiple: Joi.boolean().required(),
    embedded: Joi.boolean().required(),
    searchable: Joi.boolean().required(),
    sortable: Joi.boolean().required(),
    hidden: Joi.boolean().required(),
    internal: Joi.boolean().required(),
    restricted: Joi.boolean().required(),
    ownership: Joi.boolean().required()
});
//# sourceMappingURL=Field.js.map