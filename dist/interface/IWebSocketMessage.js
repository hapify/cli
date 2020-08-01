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
exports.WebSocketMessages = exports.WebSocketMessageSchema = void 0;
const Joi = __importStar(require("joi"));
exports.WebSocketMessageSchema = Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid(['error', 'success']),
    tag: Joi.string(),
    data: Joi.any(),
});
class WebSocketMessages {
}
exports.WebSocketMessages = WebSocketMessages;
WebSocketMessages.GET_MODELS = 'get:models';
WebSocketMessages.SET_MODELS = 'set:models';
WebSocketMessages.NEW_MODEL = 'new:model';
WebSocketMessages.GET_CHANNELS = 'get:channels';
WebSocketMessages.SET_CHANNELS = 'set:channels';
WebSocketMessages.GET_PRESETS = 'get:presets';
WebSocketMessages.APPLY_PRESETS = 'apply:presets';
WebSocketMessages.GET_INFO = 'get:info';
WebSocketMessages.PREVIEW_PATH = 'prv:path';
WebSocketMessages.PREVIEW_TEMPLATE = 'prv:template';
WebSocketMessages.VALIDATE_MODEL = 'val:model';
WebSocketMessages.GENERATE_TEMPLATE = 'gen:template';
WebSocketMessages.GENERATE_CHANNEL = 'gen:channel';
//# sourceMappingURL=IWebSocketMessage.js.map