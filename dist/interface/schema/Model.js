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
const Access_1 = require("./Access");
const Field_1 = require("./Field");
exports.ModelSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    fields: Joi.array().items(Field_1.FieldSchema).required().min(1),
    accesses: Access_1.AccessSchema
});
//# sourceMappingURL=Model.js.map