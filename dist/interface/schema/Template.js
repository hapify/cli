/*! hapify-cli 2019-05-28 */

"use strict";var __importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var i={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(i[t]=e[t]);return i.default=e,i};Object.defineProperty(exports,"__esModule",{value:!0});const Joi=__importStar(require("joi")),enum_1=require("../../enum"),engines=[enum_1.TemplateEngine.Hpf,enum_1.TemplateEngine.JavaScript],inputs=[enum_1.TemplateInput.One,enum_1.TemplateInput.All];exports.TemplateSchema=Joi.object({path:Joi.string().required(),engine:Joi.string().valid(engines).required(),input:Joi.string().valid(inputs).required(),content:Joi.string().required().allow("")}),exports.ConfigTemplateSchema=Joi.object({path:Joi.string().required(),engine:Joi.string().valid(engines).required(),input:Joi.string().valid(inputs).required()});