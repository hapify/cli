"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const service_1 = require("../service");
const typedi_1 = require("typedi");
const config_1 = require("../config");
class PresetsCollection {
    /** Constructor */
    constructor() {
        /** @type {Preset[]} The list of preset instances */
        this.presets = [];
        this.apiService = typedi_1.Container.get(service_1.ApiService);
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
    /**
     * Load the presets
     * @return {Promise<void>}
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const presets = yield this.apiService
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
            this.fromObject(presets);
        });
    }
    /**
     * Returns the list of presets
     * @returns {Promise<Preset[]>}
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.presets;
        });
    }
    /**
     * Returns one preset
     * @returns {Promise<Preset>}
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.presets.find(p => p.id === id);
        });
    }
    /** @inheritDoc */
    fromObject(object) {
        this.presets = object.map(p => new _1.Preset(p));
        return this.presets;
    }
    /** @inheritDoc */
    toObject() {
        return this.presets.map((preset) => preset.toObject());
    }
    /**
     * Returns a pseudo path
     * @returns {string}
     */
    static path() {
        return `preset`;
    }
}
exports.PresetsCollection = PresetsCollection;
//# sourceMappingURL=PresetsCollection.js.map