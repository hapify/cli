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
const Template_1 = require("./Template");
exports.ChannelSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string()
        .required()
        .allow(null),
    logo: Joi.string()
        .required()
        .allow(null),
    validator: Joi.string()
        .required()
        .allow(''),
    templates: Joi.array()
        .items(Template_1.TemplateSchema)
        .required()
});
//# sourceMappingURL=Channel.js.map