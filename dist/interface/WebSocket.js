"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketMessageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const WebSocketMessageIds = [
    'get:models',
    'set:models',
    'new:model',
    'get:channels',
    'set:channels',
    'get:presets',
    'apply:presets',
    'get:info',
    'prv:path',
    'prv:template',
    'val:model',
    'gen:template',
    'gen:channel',
];
exports.WebSocketMessageSchema = joi_1.default.object({
    id: joi_1.default.string()
        .valid(...WebSocketMessageIds)
        .required(),
    type: joi_1.default.string().valid('error', 'success'),
    tag: joi_1.default.string(),
    data: joi_1.default.any(),
});
//# sourceMappingURL=WebSocket.js.map