"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
exports.WebSocketMessageSchema = Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid(['error', 'success']),
    tag: Joi.string(),
    data: Joi.any()
});
class WebSocketMessages {
}
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
exports.WebSocketMessages = WebSocketMessages;
//# sourceMappingURL=IWebSocketMessage.js.map