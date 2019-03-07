/*! hapify-cli 2019-03-07 */

"use strict";var __importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var s={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(s[r]=e[r]);return s.default=e,s};Object.defineProperty(exports,"__esModule",{value:!0});const IObjects_1=require("../IObjects"),Joi=__importStar(require("joi")),accesses=[IObjects_1.Access.ADMIN,IObjects_1.Access.OWNER,IObjects_1.Access.AUTHENTICATED,IObjects_1.Access.GUEST];exports.AccessSchema=Joi.object({create:Joi.string().valid(accesses).required(),read:Joi.string().valid(accesses).required(),update:Joi.string().valid(accesses).required(),remove:Joi.string().valid(accesses).required(),search:Joi.string().valid(accesses).required(),count:Joi.string().valid(accesses).required()});