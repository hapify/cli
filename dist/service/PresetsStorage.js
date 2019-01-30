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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = require("../config");
const Api_1 = require("./Api");
let PresetsStorageService = class PresetsStorageService {
    /**
     * Constructor
     */
    constructor(apiService) {
        this.apiService = apiService;
    }
    /**
     * Load the presets from api
     * @return {Promise<void>}
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiService
                .get('preset', {
                _page: 0,
                _limit: config_1.ConfigRemote.presetsLimit
            })
                .then(response => {
                return response.data.items.map((p) => ({
                    id: p._id,
                    name: p.name,
                    name__fr: p.name__fr,
                    description: p.description,
                    description__fr: p.description__fr,
                    icon: p.icon,
                    models: p.models.map((m) => ({
                        id: m._id,
                        name: m.name,
                        fields: m.fields,
                        accesses: m.accesses
                    }))
                }));
            });
        });
    }
};
PresetsStorageService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Api_1.ApiService])
], PresetsStorageService);
exports.PresetsStorageService = PresetsStorageService;
//# sourceMappingURL=PresetsStorage.js.map