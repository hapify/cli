"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectV1Parser = void 0;
class ProjectV1Parser {
    convert(input) {
        return {
            version: '2',
            name: input.name,
            description: input.description,
            models: input.models.map((model) => ({
                id: model.id,
                name: model.name,
                accesses: model.accesses,
                fields: model.fields.map((field) => ({
                    name: field.name,
                    type: field.type,
                    subtype: field.subtype,
                    value: field.reference,
                    properties: field.properties,
                    notes: field.notes,
                })),
                notes: model.notes,
            })),
        };
    }
}
exports.ProjectV1Parser = ProjectV1Parser;
//# sourceMappingURL=ProjectV1Parser.js.map