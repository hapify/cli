"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModelV1Parser = void 0;
const Converter_1 = require("../../Converter");
const typedi_1 = require("typedi");
class ApiModelV1Parser {
    constructor() {
        this.converterService = typedi_1.Container.get(Converter_1.ConverterService);
    }
    convert(input) {
        return {
            version: '2',
            _id: input._id,
            created_at: input.created_at,
            updated_at: input.updated_at,
            owner: input.owner,
            project: input.project,
            name: input.name,
            notes: input.notes,
            fields: input.fields.map((f) => ({
                name: f.name,
                type: f.type,
                subtype: f.subtype,
                value: f.reference,
                properties: this.converterService.convertBooleanPropertiesToCompactFormat(f),
                notes: f.notes,
            })),
            accesses: input.accesses,
        };
    }
}
exports.ApiModelV1Parser = ApiModelV1Parser;
//# sourceMappingURL=ApiModelV1Parser.js.map