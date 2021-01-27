"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterService = void 0;
const typedi_1 = require("typedi");
let ConverterService = class ConverterService {
    constructor() {
        this.booleanFieldPropertiesNames = [
            'primary',
            'unique',
            'label',
            'nullable',
            'multiple',
            'embedded',
            'searchable',
            'sortable',
            'hidden',
            'internal',
            'restricted',
            'ownership',
        ];
    }
    convertFieldToCompactFormat(field) {
        return {
            name: field.name,
            type: field.type,
            subtype: field.subtype || undefined,
            value: field.value || undefined,
            properties: this.convertBooleanPropertiesToCompactFormat(field),
            notes: field.notes || undefined,
        };
    }
    convertBooleanPropertiesToCompactFormat(field) {
        return this.booleanFieldPropertiesNames
            .map((property) => {
            return field[property] ? property : null;
        })
            .filter((p) => !!p);
    }
    convertFieldFromCompactFormat(field) {
        return {
            name: field.name,
            type: field.type,
            subtype: field.subtype || null,
            value: field.value || null,
            primary: field.properties.includes('primary'),
            unique: field.properties.includes('unique'),
            label: field.properties.includes('label'),
            nullable: field.properties.includes('nullable'),
            multiple: field.properties.includes('multiple'),
            embedded: field.properties.includes('embedded'),
            searchable: field.properties.includes('searchable'),
            sortable: field.properties.includes('sortable'),
            hidden: field.properties.includes('hidden'),
            internal: field.properties.includes('internal'),
            restricted: field.properties.includes('restricted'),
            ownership: field.properties.includes('ownership'),
            notes: field.notes || null,
        };
    }
};
ConverterService = __decorate([
    typedi_1.Service()
], ConverterService);
exports.ConverterService = ConverterService;
//# sourceMappingURL=Converter.js.map