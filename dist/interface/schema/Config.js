"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Template_1 = require("./Template");
const Joi = __importStar(require("joi"));
const Field_1 = require("./Field");
exports.ConfigSchema = Joi.object({
    validatorPath: Joi.string().required(),
    project: Joi.string()
        .hex()
        .required(),
    name: Joi.string(),
    description: Joi.string(),
    logo: Joi.string(),
    defaultFields: Joi.array()
        .items(Field_1.FieldSchema)
        .required()
        .min(0),
    templates: Joi.array()
        .items(Template_1.ConfigTemplateSchema)
        .required()
        .min(0)
});
//# sourceMappingURL=Config.js.map