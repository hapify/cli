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
exports.ConfigSchema = void 0;
const Template_1 = require("./Template");
const Joi = __importStar(require("joi"));
const Field_1 = require("./Field");
const Versions = ['1'];
exports.ConfigSchema = Joi.object({
    version: Joi.string()
        .valid(Versions)
        .required(),
    validatorPath: Joi.string().required(),
    project: Joi.string()
        .hex()
        .required(),
    name: Joi.string(),
    description: Joi.string(),
    logo: Joi.string(),
    defaultFields: Joi.array()
        .items(Field_1.FieldSchema)
        .min(0),
    templates: Joi.array()
        .items(Template_1.ConfigTemplateSchema)
        .required()
        .min(0)
});
//# sourceMappingURL=Config.js.map