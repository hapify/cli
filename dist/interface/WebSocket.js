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
exports.WebSocketMessageSchema = void 0;
const Joi = __importStar(require("joi"));
const WebSocketMessages = [
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
exports.WebSocketMessageSchema = Joi.object({
    id: Joi.string().valid(WebSocketMessages).required(),
    type: Joi.string().valid(['error', 'success']),
    tag: Joi.string(),
    data: Joi.any(),
});
//# sourceMappingURL=WebSocket.js.map