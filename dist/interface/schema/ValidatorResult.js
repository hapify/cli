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
exports.TransformValidationMessage = exports.ValidatorResultSchema = void 0;
const Joi = __importStar(require("joi"));
exports.ValidatorResultSchema = Joi.object({
    errors: Joi.array().items(Joi.string()).required().min(0),
    warnings: Joi.array().items(Joi.string()).required().min(0),
});
function TransformValidationMessage(error) {
    if (error.details && error.details.length) {
        error.message = error.details.map((d) => `${d.message} (${d.path.join('.')})`).join('. ');
    }
    return error;
}
exports.TransformValidationMessage = TransformValidationMessage;
//# sourceMappingURL=ValidatorResult.js.map