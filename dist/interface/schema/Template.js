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
exports.TemplateSchema = Joi.object({
    name: Joi.string().required(),
    path: Joi.string().required(),
    engine: Joi.string().required(),
    input: Joi.string().required(),
    content: Joi.string().required().allow('')
});
//# sourceMappingURL=Template.js.map