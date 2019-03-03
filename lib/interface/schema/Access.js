"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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