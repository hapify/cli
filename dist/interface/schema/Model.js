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
exports.ModelSchema = void 0;
const Joi = __importStar(require("joi"));
const Access_1 = require("./Access");
const Field_1 = require("./Field");
exports.ModelSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    notes: Joi.string().allow(null),
    fields: Joi.array()
        .items(Field_1.FieldSchema)
        .required()
        .min(0),
    accesses: Access_1.AccessSchema
});
//# sourceMappingURL=Model.js.map