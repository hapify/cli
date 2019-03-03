/*! hapify-cli 2019-03-03 */

"use strict";var __importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var i in e)Object.hasOwnProperty.call(e,i)&&(r[i]=e[i]);return r.default=e,r};Object.defineProperty(exports,"__esModule",{value:!0});const Joi=__importStar(require("joi")),Template_1=require("./Template");exports.ChannelSchema=Joi.object({id:Joi.string().required(),name:Joi.string().required(),description:Joi.string().required().allow(null),logo:Joi.string().required().allow(null),validator:Joi.string().required().allow(""),templates:Joi.array().items(Template_1.TemplateSchema).required()});