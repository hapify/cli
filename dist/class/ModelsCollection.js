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
class ModelsCollection extends _1.SingleSave {
    /**
     * Constructor
     * @param {string} project
     */
    constructor(project) {
        super();
        this.project = project;
        this.apiService = typedi_1.Container.get(service_1.ApiService);
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
            const modelsCollection = ModelsCollection.instances.find((m) => m.path === path);
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
            const models = yield this.apiService.get('model', {
                _page: 0,
                _limit: 100,
                project: this.project
            })
                .then(response => {
                return response.data.items
                    .map((m) => ({
                    id: m._id,
                    name: m.name,
                    fields: m.fields,
                    accesses: m.accesses,
                }));
            });
            this.fromObject(models);
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // const data = JSON.stringify(this.toObject(), null, 2);
            // if (this.shouldSave(data)) {
            //   await this.s3service.putObject({
            //     Body: Buffer.from(data, 'utf8'),
            //     Bucket: this.config.bucket,
            //     Key: this.config.path
            //   })
            //     .promise();
            // }
        });
    }
    /**
     * Find a instance with its id
     * @param {string} id
     * @returns {Promise<Model|null>}
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.models.find((instance) => instance.id === id);
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
        this.models = object.map((model) => {
            const m = new _1.Model();
            return m.fromObject(model);
        });
        return this.models;
    }
    /** @inheritDoc */
    toObject() {
        return this.models.map((model) => model.toObject());
    }
    /**
     * Returns a pseudo path
     * @returns {string}
     */
    static path(project) {
        return `api:${project}`;
    }
}
/** @type {string} The loaded instances */
ModelsCollection.instances = [];
exports.ModelsCollection = ModelsCollection;
//# sourceMappingURL=ModelsCollection.js.map