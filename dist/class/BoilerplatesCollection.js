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
const _1 = require("./");
const service_1 = require("../service");
const typedi_1 = require("typedi");
class BoilerplatesCollection {
    /** Constructor */
    constructor() {
        /** @type {Boilerplate[]} The list of boilerplate instances */
        this.boilerplates = [];
        this.storageService = typedi_1.Container.get(service_1.BoilerplatesApiStorageService);
    }
    /** Returns a singleton for this config */
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!BoilerplatesCollection.instance) {
                // Create and load a new collection
                BoilerplatesCollection.instance = new BoilerplatesCollection();
                yield BoilerplatesCollection.instance.load();
            }
            return BoilerplatesCollection.instance;
        });
    }
    /**
     * Load the boilerplates
     * @return {Promise<void>}
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromObject(yield this.storageService.list());
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to save
        });
    }
    /**
     * Returns the list of boilerplates
     * @returns {Promise<Boilerplate[]>}
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boilerplates;
        });
    }
    /**
     * Returns one boilerplate
     * @returns {Promise<Boilerplate>}
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boilerplates.find(p => p.id === id);
        });
    }
    /**
     * Returns one boilerplate by its slug
     * @returns {Promise<Boilerplate>}
     */
    getBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.storageService.list({
                _limit: 1,
                slug
            });
            return data.length ? new _1.Boilerplate(data[0]) : null;
        });
    }
    /** @inheritDoc */
    fromObject(object) {
        this.boilerplates = object.map(p => new _1.Boilerplate(p));
        return this.boilerplates;
    }
    /** @inheritDoc */
    toObject() {
        return this.boilerplates.map(p => p.toObject());
    }
}
exports.BoilerplatesCollection = BoilerplatesCollection;
//# sourceMappingURL=BoilerplatesCollection.js.map