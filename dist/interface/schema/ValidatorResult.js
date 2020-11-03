"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformValidationMessage = exports.ValidatorResultSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ValidatorResultSchema = joi_1.default.object({
    errors: joi_1.default.array().items(joi_1.default.string()).required().min(0),
    warnings: joi_1.default.array().items(joi_1.default.string()).required().min(0),
});
function TransformValidationMessage(error) {
    if (error.details && error.details.length) {
        error.message = error.details.map((d) => `${d.message} (${d.path.join('.')})`).join('. ');
    }
    return error;
}
exports.TransformValidationMessage = TransformValidationMessage;
//# sourceMappingURL=ValidatorResult.js.map