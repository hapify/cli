"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const Access_1 = require("./Access");
const Field_1 = require("./Field");
exports.ModelSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    notes: joi_1.default.string().allow(null),
    fields: joi_1.default.array().items(Field_1.FieldSchema).required().min(0),
    accesses: Access_1.AccessSchema,
});
//# sourceMappingURL=Model.js.map