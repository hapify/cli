"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
exports.FieldSchema = Joi.object({
    name: Joi.string().required(),
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