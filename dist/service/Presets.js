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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetsService = void 0;
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
            const referencesMap = {};
            for (const model of presetModels) {
                const existing = models.find(m => m.name === model.name);
                if (existing) {
                    // Save incoming reference to existing reference
                    referencesMap[model.id] = existing.id;
                    // Add or skip each fields
                    const clone = existing.clone(false);
                    const existingHasPrimary = existing.fields.some(f => f.primary);
                    let edited = false;
                    for (const field of model.fields) {
                        // Prevent adding primary key if already exists
                        if (existingHasPrimary && field.primary) {
                            continue;
                        }
                        // Add this field if nothing with the same name was found
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
                    // Clone model with new id
                    const clone = model.clone(true);
                    // Save incoming reference to existing reference
                    referencesMap[model.id] = clone.id;
                    const defaultFields = (yield this.infoService.fields()).map(f => new class_1.Field(f));
                    // Apply special properties to primary field
                    const defaultPrimary = defaultFields.find(f => f.primary);
                    const clonePrimary = clone.fields.find(f => f.primary);
                    if (defaultPrimary && clonePrimary) {
                        // Apply clone primary properties to default primary
                        defaultPrimary.ownership = clonePrimary.ownership;
                        // Remove primary from clone
                        clone.fields = clone.fields.filter(f => !f.primary);
                    }
                    clone.fields = defaultFields.concat(clone.fields);
                    created.push(clone);
                }
            }
            // Change references to existing models
            const changeReferencesToNewModels = (m) => {
                for (const f of m.fields) {
                    if (f.type === class_1.FieldType.Entity &&
                        typeof referencesMap[f.reference] === 'string') {
                        f.reference = referencesMap[f.reference];
                    }
                }
            };
            updated.forEach(changeReferencesToNewModels);
            created.forEach(changeReferencesToNewModels);
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