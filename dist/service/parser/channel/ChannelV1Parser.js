"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelV1Parser = void 0;
const typedi_1 = require("typedi");
const Converter_1 = require("../../Converter");
class ChannelV1Parser {
    constructor() {
        this.converterService = typedi_1.Container.get(Converter_1.ConverterService);
    }
    convert(input) {
        return {
            version: '2',
            validatorPath: input.validatorPath,
            project: input.project,
            name: input.name,
            description: input.description,
            logo: input.logo,
            defaultFields: input.defaultFields
                ? input.defaultFields.map((f) => ({
                    name: f.name,
                    type: f.type,
                    subtype: f.subtype,
                    value: f.reference,
                    properties: this.converterService.convertBooleanPropertiesToCompactFormat(f),
                    notes: f.notes,
                }))
                : undefined,
            templates: input.templates,
        };
    }
}
exports.ChannelV1Parser = ChannelV1Parser;
//# sourceMappingURL=ChannelV1Parser.js.map