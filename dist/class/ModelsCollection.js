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
exports.ModelsCollection = void 0;
const typedi_1 = require("typedi");
const Model_1 = require("./Model");
const Models_1 = require("../service/storage/api/Models");
const Project_1 = require("../service/storage/file/Project");
class ModelsCollection {
    constructor(project) {
        this.project = project;
        this.remoteStorageService = typedi_1.Container.get(Models_1.ModelsApiStorageService);
        this.localStorageService = typedi_1.Container.get(Project_1.ProjectFileStorageService);
        this.path = ModelsCollection.path(project);
    }
    /** Returns a singleton for this config */
    static getInstance(project) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = ModelsCollection.path(project);
            const key = 'ModelsCollectionSingletons';
            const instances = typedi_1.Container.has(key) ? typedi_1.Container.get(key) : [];
            // Try to find an existing collection
            const modelsCollection = instances.find((m) => m.path === path);
            if (modelsCollection) {
                return modelsCollection;
            }
            // Create and load a new collection
            const collection = new ModelsCollection(project);
            yield collection.load();
            // Keep the collection
            instances.push(collection);
            typedi_1.Container.set(key, instances);
            return collection;
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.project.storageType === 'local') {
                this.fromObject(yield this.localStorageService.getModels(this.project.id));
            }
            else {
                this.fromObject(yield this.remoteStorageService.forProject(this.project.id));
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.project.storageType === 'local') {
                yield this.localStorageService.setModels(this.project.id, this.toObject());
            }
            else {
                const models = yield this.remoteStorageService.set(this.project.id, this.toObject());
                this.fromObject(models);
            }
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
                this.models.push(new Model_1.Model(object));
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
                this.models = this.models.filter((i) => i.id === object.id);
            }
        });
    }
    /** Find a instance with its id */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.models.find((instance) => instance.id === id);
        });
    }
    /** Returns the list of models */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.models;
        });
    }
    fromObject(object) {
        this.models = object.map((m) => new Model_1.Model(m));
        return this.models;
    }
    toObject() {
        return this.models.map((m) => m.toObject());
    }
    /** Returns a pseudo path */
    static path(project) {
        return project.storageType === 'local' ? project.id : `project:${project.id}`;
    }
}
exports.ModelsCollection = ModelsCollection;
//# sourceMappingURL=ModelsCollection.js.map