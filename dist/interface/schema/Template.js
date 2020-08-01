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
exports.ConfigTemplateSchema = exports.TemplateSchema = void 0;
const Joi = __importStar(require("joi"));
const TemplateEngine_1 = require("../../enum/TemplateEngine");
const TemplateInput_1 = require("../../enum/TemplateInput");
const engines = [TemplateEngine_1.TemplateEngine.Hpf, TemplateEngine_1.TemplateEngine.JavaScript];
const inputs = [TemplateInput_1.TemplateInput.One, TemplateInput_1.TemplateInput.All];
exports.TemplateSchema = Joi.object({
    path: Joi.string().required(),
    engine: Joi.string().valid(engines).required(),
    input: Joi.string().valid(inputs).required(),
    content: Joi.string().required().allow(''),
});
exports.ConfigTemplateSchema = Joi.object({
    path: Joi.string().required(),
    engine: Joi.string().valid(engines).required(),
    input: Joi.string().valid(inputs).required(),
});
//# sourceMappingURL=Template.js.map