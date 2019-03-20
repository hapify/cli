/*! hapify-cli 2019-03-20 */

"use strict";var __importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var i in e)Object.hasOwnProperty.call(e,i)&&(r[i]=e[i]);return r.default=e,r};Object.defineProperty(exports,"__esModule",{value:!0});const Joi=__importStar(require("joi")),Access_1=require("./Access"),Field_1=require("./Field");exports.ModelSchema=Joi.object({id:Joi.string().required(),name:Joi.string().required(),fields:Joi.array().items(Field_1.FieldSchema).required().min(0),accesses:Access_1.AccessSchema});