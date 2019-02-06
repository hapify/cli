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
const typedi_1 = require("typedi");
const service_1 = require("../service");
class ModelsCollection {
    /**
     * Constructor
     * @param {string} project
     */
    constructor(project) {
        this.project = project;
        this.storageService = typedi_1.Container.get(service_1.ModelsApiStorageService);
        this.path = ModelsCollection.path(project);
    }
    /**
     * Returns a singleton for this config
     * @param {string} project
     */
    static getInstance(project) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = ModelsCollection.path(project);
            // Try to find an existing collection
            const modelsCollection = ModelsCollection.instances.find(m => m.path === path);
            if (modelsCollection) {
                return modelsCollection;
            }
            // Create and load a new collection
            const collection = new ModelsCollection(project);
            yield collection.load();
            // Keep the collection
            ModelsCollection.instances.push(collection);
            return collection;
        });
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromObject(yield this.storageService.forProject(this.project));
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const models = yield this.storageService.set(this.project, this.toObject());
            this.fromObject(models);
        });
    }
    /** Add one or more object to the stack */
    add(object) {
        return __awaiter(this, void 0, void 0, function* () {
            if (object instanceof Array) {
                for (const o of object) {
                    yield this.add(o);
                }
            }
            else {
                this.models.push(new _1.Model(object));
            }
        });
    }
    /** Upsert one or more object to the stack */
    update(object) {
        return __awaiter(this, void 0, void 0, function* () {
            if (object instanceof Array) {
                for (const o of object) {
                    yield this.update(o);
                }
            }
            else {
                yield this.remove(object);
                yield this.add(object);
            }
        });
    }
    /** Remove an existing object */
    remove(object) {
        return __awaiter(this, void 0, void 0, function* () {
            if (object instanceof Array) {
                for (const o of object) {
                    yield this.remove(o);
                }
            }
            else {
                this.models = this.models.filter(i => i.id === object.id);
            }
        });
    }
    /**
     * Find a instance with its id
     * @param {string} id
     * @returns {Promise<Model|null>}
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.models.find(instance => instance.id === id);
        });
    }
    /**
     * Returns the list of models
     * @returns {Promise<Model[]>}
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.models;
        });
    }
    /** @inheritDoc */
    fromObject(object) {
        this.models = object.map(m => new _1.Model(m));
        return this.models;
    }
    /** @inheritDoc */
    toObject() {
        return this.models.map(m => m.toObject());
    }
    /**
     * Returns a pseudo path
     * @returns {string}
     */
    static path(project) {
        return `project:${project}`;
    }
}
/** The loaded instances */
ModelsCollection.instances = [];
exports.ModelsCollection = ModelsCollection;
//# sourceMappingURL=ModelsCollection.js.map