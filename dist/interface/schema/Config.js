"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConfigSchema = exports.ProjectConfigSchema = exports.ConfigSchema = void 0;
const Template_1 = require("./Template");
const joi_1 = __importDefault(require("joi"));
const Field_1 = require("./Field");
const Model_1 = require("./Model");
const Versions = ['2'];
exports.ConfigSchema = joi_1.default.object({
    version: joi_1.default.string()
        .valid(...Versions)
        .required(),
    validatorPath: joi_1.default.string().required(),
    project: joi_1.default.string().required(),
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    logo: joi_1.default.string(),
    defaultFields: joi_1.default.array().items(Field_1.FieldSchema).min(0),
    templates: joi_1.default.array().items(Template_1.ConfigTemplateSchema).required().min(0),
});
exports.ProjectConfigSchema = joi_1.default.object({
    version: joi_1.default.string()
        .valid(...Versions)
        .required(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string(),
    models: joi_1.default.array().items(Model_1.ModelSchema).required().min(0),
});
exports.GlobalConfigSchema = joi_1.default.object({
    apiKey: joi_1.default.string().length(48),
    apiUrl: joi_1.default.string().min(1),
});
//# sourceMappingURL=Config.js.map