"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetsApiStorageService = void 0;
const typedi_1 = require("typedi");
const Base_1 = require("./Base");
const Options_1 = require("../../Options");
const Converter_1 = require("../../Converter");
const ApiPresetParser_1 = require("../../parser/preset/ApiPresetParser");
const Version_1 = require("../../Version");
let PresetsApiStorageService = class PresetsApiStorageService extends Base_1.BaseApiStorageService {
    constructor(optionsService, converterService, versionService) {
        super(optionsService);
        this.converterService = converterService;
        this.versionService = versionService;
    }
    defaultSearchParams() {
        const s = super.defaultSearchParams();
        s._limit = this.remoteConfig.presetsLimit;
        s.version = this.versionService.getCurrentVersion('preset');
        return s;
    }
    path() {
        return 'preset';
    }
    convertToCurrentVersion(object) {
        return new ApiPresetParser_1.ApiPresetParser(object).convert();
    }
    fromApi(object) {
        return {
            id: object._id,
            name: object.name,
            name__fr: object.name__fr,
            description: object.description,
            description__fr: object.description__fr,
            icon: object.icon,
            models: object.models.map((m) => ({
                id: m._id,
                name: m.name,
                notes: m.notes || null,
                fields: m.fields.map((f) => this.converterService.convertFieldFromCompactFormat(f)),
                accesses: m.accesses,
            })),
        };
    }
    requiresAuthentication() {
        return false;
    }
};
PresetsApiStorageService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Options_1.OptionsService, Converter_1.ConverterService, Version_1.VersionService])
], PresetsApiStorageService);
exports.PresetsApiStorageService = PresetsApiStorageService;
//# sourceMappingURL=Presets.js.map