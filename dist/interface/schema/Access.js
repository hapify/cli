"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const AccessValues = ['admin', 'owner', 'auth', 'guest'];
exports.AccessSchema = joi_1.default.object({
    create: joi_1.default.string()
        .valid(...AccessValues)
        .required(),
    read: joi_1.default.string()
        .valid(...AccessValues)
        .required(),
    update: joi_1.default.string()
        .valid(...AccessValues)
        .required(),
    remove: joi_1.default.string()
        .valid(...AccessValues)
        .required(),
    search: joi_1.default.string()
        .valid(...AccessValues)
        .required(),
    count: joi_1.default.string()
        .valid(...AccessValues)
        .required(),
});
//# sourceMappingURL=Access.js.map