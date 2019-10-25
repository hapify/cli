/*! hapify-cli 2019-10-25 */

"use strict";var __importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var i={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(i[r]=e[r]);return i.default=e,i};Object.defineProperty(exports,"__esModule",{value:!0});const Template_1=require("./Template"),Joi=__importStar(require("joi")),Field_1=require("./Field"),Versions=["1"];exports.ConfigSchema=Joi.object({version:Joi.string().valid(Versions).required(),validatorPath:Joi.string().required(),project:Joi.string().hex().required(),name:Joi.string(),description:Joi.string(),logo:Joi.string(),defaultFields:Joi.array().items(Field_1.FieldSchema).min(0),templates:Joi.array().items(Template_1.ConfigTemplateSchema).required().min(0)});