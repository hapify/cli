/*! hapify-cli 2019-03-11 */

"use strict";var __importStar=this&&this.__importStar||function(r){if(r&&r.__esModule)return r;var t={};if(null!=r)for(var e in r)Object.hasOwnProperty.call(r,e)&&(t[e]=r[e]);return t.default=r,t};Object.defineProperty(exports,"__esModule",{value:!0});const Joi=__importStar(require("joi"));exports.GlobalConfigSchema=Joi.object({apiKey:Joi.string().min(1)});