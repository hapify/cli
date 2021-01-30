"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigTemplateSchema = exports.TemplateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const TemplateInputs = ['one', 'all'];
const TemplateEngines = ['hpf', 'js', 'ejs'];
exports.TemplateSchema = joi_1.default.object({
    path: joi_1.default.string().required(),
    engine: joi_1.default.string()
        .valid(...TemplateEngines)
        .required(),
    input: joi_1.default.string()
        .valid(...TemplateInputs)
        .required(),
    content: joi_1.default.string().required().allow(''),
});
exports.ConfigTemplateSchema = joi_1.default.object({
    path: joi_1.default.string().required(),
    engine: joi_1.default.string()
        .valid(...TemplateEngines)
        .required(),
    input: joi_1.default.string()
        .valid(...TemplateInputs)
        .required(),
});
//# sourceMappingURL=Template.js.map