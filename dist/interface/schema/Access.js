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
exports.AccessSchema = void 0;
const IObjects_1 = require("../IObjects");
const Joi = __importStar(require("joi"));
const accesses = [
    IObjects_1.Access.ADMIN,
    IObjects_1.Access.OWNER,
    IObjects_1.Access.AUTHENTICATED,
    IObjects_1.Access.GUEST
];
exports.AccessSchema = Joi.object({
    create: Joi.string()
        .valid(accesses)
        .required(),
    read: Joi.string()
        .valid(accesses)
        .required(),
    update: Joi.string()
        .valid(accesses)
        .required(),
    remove: Joi.string()
        .valid(accesses)
        .required(),
    search: Joi.string()
        .valid(accesses)
        .required(),
    count: Joi.string()
        .valid(accesses)
        .required()
});
//# sourceMappingURL=Access.js.map