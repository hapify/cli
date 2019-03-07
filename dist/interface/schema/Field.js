/*! hapify-cli 2019-03-07 */

"use strict";var __importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var o in e)Object.hasOwnProperty.call(e,o)&&(r[o]=e[o]);return r.default=e,r};Object.defineProperty(exports,"__esModule",{value:!0});const Joi=__importStar(require("joi"));exports.FieldSchema=Joi.object({name:Joi.string().required(),type:Joi.string().required(),subtype:Joi.string().required().allow(null),reference:Joi.string().required().allow(null),primary:Joi.boolean().required(),unique:Joi.boolean().required(),label:Joi.boolean().required(),nullable:Joi.boolean().required(),multiple:Joi.boolean().required(),embedded:Joi.boolean().required(),searchable:Joi.boolean().required(),sortable:Joi.boolean().required(),hidden:Joi.boolean().required(),internal:Joi.boolean().required(),restricted:Joi.boolean().required(),ownership:Joi.boolean().required()});