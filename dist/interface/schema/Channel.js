"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const Template_1 = require("./Template");
exports.ChannelSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required().allow(null),
    logo: joi_1.default.string().required().allow(null),
    validator: joi_1.default.string().required().allow(''),
    templates: joi_1.default.array().items(Template_1.TemplateSchema).required(),
});
//# sourceMappingURL=Channel.js.map