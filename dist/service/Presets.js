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
const class_1 = require("../class");
const Channels_1 = require("./Channels");
const Info_1 = require("./Info");
let PresetsService = class PresetsService {
    /**
     * Constructor
     */
    constructor(channelsService, infoService) {
        this.channelsService = channelsService;
        this.infoService = infoService;
    }
    /**
     * Returns the presets collection
     * @return {PresetsCollection}
     * @throws {Error}
     */
    collection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield class_1.PresetsCollection.getInstance();
        });
    }
    /**
     * Apply one preset to models
     */
    apply(presetModels) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add or update each models
            const updated = [];
            const created = [];
            // List
            const modelsCollection = yield this.channelsService.modelsCollection();
            const models = yield modelsCollection.list();
            for (const model of presetModels) {
                const existing = models.find(m => m.name === model.name);
                if (existing) {
                    // Add or skip each fields
                    const clone = existing.clone(false);
                    let edited = false;
                    for (const field of model.fields) {
                        if (!clone.fields.some(f => f.name === field.name)) {
                            clone.fields.push(field);
                            edited = true;
                        }
                    }
                    if (edited) {
                        updated.push(clone);
                    }
                }
                else {
                    const clone = model.clone(true);
                    const defaultFields = (yield this.infoService.fields()).map(f => new class_1.Field(f));
                    clone.fields = defaultFields.concat(clone.fields);
                    created.push(clone);
                }
            }
            // Return results
            return {
                updated,
                created
            };
        });
    }
};
PresetsService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Channels_1.ChannelsService,
        Info_1.InfoService])
], PresetsService);
exports.PresetsService = PresetsService;
//# sourceMappingURL=Presets.js.map