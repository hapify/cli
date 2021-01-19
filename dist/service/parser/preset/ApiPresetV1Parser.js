"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPresetV1Parser = void 0;
const ApiModelParser_1 = require("../model/ApiModelParser");
class ApiPresetV1Parser {
    convert(input) {
        return {
            version: '2',
            _id: input._id,
            models: input.models.map((model) => new ApiModelParser_1.ApiModelParser(model).convert()),
            name: input.name,
            name__fr: input.name__fr,
            slug: input.slug,
            icon: input.icon,
            description: input.description,
            description__fr: input.description__fr,
            created_at: input.created_at,
        };
    }
}
exports.ApiPresetV1Parser = ApiPresetV1Parser;
//# sourceMappingURL=ApiPresetV1Parser.js.map