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
const enum_1 = require("../../enum");
const engines = [enum_1.TemplateEngine.Hpf, enum_1.TemplateEngine.JavaScript];
const inputs = [enum_1.TemplateInput.One, enum_1.TemplateInput.All];
exports.TemplateSchema = Joi.object({
    path: Joi.string().required(),
    engine: Joi.string()
        .valid(engines)
        .required(),
    input: Joi.string()
        .valid(inputs)
        .required(),
    content: Joi.string()
        .required()
        .allow('')
});
exports.ConfigTemplateSchema = Joi.object({
    path: Joi.string().required(),
    engine: Joi.string()
        .valid(engines)
        .required(),
    input: Joi.string()
        .valid(inputs)
        .required()
});
//# sourceMappingURL=Template.js.map