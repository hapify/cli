/*! hapify-cli 2019-03-07 */

"use strict";var __importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var s={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(s[t]=e[t]);return s.default=e,s};Object.defineProperty(exports,"__esModule",{value:!0});const Joi=__importStar(require("joi"));exports.WebSocketMessageSchema=Joi.object({id:Joi.string().required(),type:Joi.string().valid(["error","success"]),tag:Joi.string(),data:Joi.any()});class WebSocketMessages{}WebSocketMessages.GET_MODELS="get:models",WebSocketMessages.SET_MODELS="set:models",WebSocketMessages.NEW_MODEL="new:model",WebSocketMessages.GET_CHANNELS="get:channels",WebSocketMessages.SET_CHANNELS="set:channels",WebSocketMessages.GET_PRESETS="get:presets",WebSocketMessages.APPLY_PRESETS="apply:presets",WebSocketMessages.GET_INFO="get:info",WebSocketMessages.PREVIEW_PATH="prv:path",WebSocketMessages.PREVIEW_TEMPLATE="prv:template",WebSocketMessages.VALIDATE_MODEL="val:model",WebSocketMessages.GENERATE_TEMPLATE="gen:template",WebSocketMessages.GENERATE_CHANNEL="gen:channel",exports.WebSocketMessages=WebSocketMessages;