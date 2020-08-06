"use strict";
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
exports.PresetsCollection = void 0;
const typedi_1 = require("typedi");
const Preset_1 = require("./Preset");
const Presets_1 = require("../service/storage/api/Presets");
class PresetsCollection {
    constructor() {
        /** The list of preset instances */
        this.presets = [];
        this._storageService = typedi_1.Container.get(Presets_1.PresetsApiStorageService);
    }
    get storageService() {
        return this._storageService;
    }
    set storageService(value) {
        this._storageService = value;
    }
    /** Returns a singleton for this config */
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!PresetsCollection.instance) {
                // Create and load a new collection
                PresetsCollection.instance = new PresetsCollection();
                yield PresetsCollection.instance.load();
            }
            return PresetsCollection.instance;
        });
    }
    /** Load the presets */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromObject(yield this._storageService.list());
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to save
        });
    }
    /** Returns the list of presets */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.presets;
        });
    }
    /** Returns one preset */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.presets.find((p) => p.id === id);
        });
    }
    fromObject(object) {
        this.presets = object.map((p) => new Preset_1.Preset(p));
        return this.presets;
    }
    toObject() {
        return this.presets.map((p) => p.toObject());
    }
}
exports.PresetsCollection = PresetsCollection;
//# sourceMappingURL=PresetsCollection.js.map