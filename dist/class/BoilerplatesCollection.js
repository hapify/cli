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
exports.BoilerplatesCollection = void 0;
const typedi_1 = require("typedi");
const Boilerplate_1 = require("./Boilerplate");
const Boilerplates_1 = require("../service/storage/api/Boilerplates");
class BoilerplatesCollection {
    constructor() {
        /** The list of boilerplate instances */
        this.boilerplates = [];
        this.storageService = typedi_1.Container.get(Boilerplates_1.BoilerplatesApiStorageService);
    }
    /** Returns a singleton for this config */
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = 'BoilerplatesCollectionSingleton';
            let instance = typedi_1.Container.has(key) ? typedi_1.Container.get(key) : null;
            if (!instance) {
                // Create and load a new collection
                instance = new BoilerplatesCollection();
                yield instance.load();
                typedi_1.Container.set(key, instance);
            }
            return instance;
        });
    }
    /** Load the boilerplates */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromObject(yield this.storageService.list());
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to save
        });
    }
    /** Returns the list of boilerplates */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boilerplates;
        });
    }
    /** Returns one boilerplate */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boilerplates.find((p) => p.id === id);
        });
    }
    /** Returns one boilerplate by its slug */
    getBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.storageService.list({
                _limit: 1,
                slug,
            });
            return data.length ? new Boilerplate_1.Boilerplate(data[0]) : null;
        });
    }
    fromObject(object) {
        this.boilerplates = object.map((p) => new Boilerplate_1.Boilerplate(p));
        return this.boilerplates;
    }
    toObject() {
        return this.boilerplates.map((p) => p.toObject());
    }
}
exports.BoilerplatesCollection = BoilerplatesCollection;
//# sourceMappingURL=BoilerplatesCollection.js.map