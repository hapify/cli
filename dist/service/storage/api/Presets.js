"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetsApiStorageService = void 0;
const typedi_1 = require("typedi");
const Base_1 = require("./Base");
let PresetsApiStorageService = class PresetsApiStorageService extends Base_1.BaseApiStorageService {
    /** @inheritDoc */
    defaultSearchParams() {
        const s = super.defaultSearchParams();
        s._limit = this.remoteConfig.presetsLimit;
        return s;
    }
    /** @inheritDoc */
    path() {
        return 'preset';
    }
    /** @inheritDoc */
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
                fields: m.fields,
                accesses: m.accesses
            }))
        };
    }
};
PresetsApiStorageService = __decorate([
    typedi_1.Service()
], PresetsApiStorageService);
exports.PresetsApiStorageService = PresetsApiStorageService;
//# sourceMappingURL=Presets.js.map