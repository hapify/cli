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
const S3 = require("aws-sdk/clients/s3");
const _1 = require("./");
class ModelsCollection extends _1.SingleSave {
    /**
     * Constructor
     * @param {IConfigModel} config
     */
    constructor(config) {
        super();
        this.config = config;
        this.s3service = new S3({
            region: config.region,
            accessKeyId: config.key,
            secretAccessKey: config.secret
        });
        this.path = ModelsCollection.path(config);
    }
    /**
     * Returns a singleton for this config
     * @param {IConfigModel} config
     */
    static getInstance(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = ModelsCollection.path(config);
            // Try to find an existing collection
            const modelsCollection = ModelsCollection.instances.find((m) => m.path === path);
            if (modelsCollection) {
                return modelsCollection;
            }
            // Create and load a new collection
            const collection = new ModelsCollection(config);
            yield collection.load();
            // Keep the collection
            ModelsCollection.instances.push(collection);
            return collection;
        });
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const models = yield this.s3service.getObject({
                Bucket: this.config.bucket,
                Key: this.config.path
            })
                .promise()
                .then((data) => {
                const content = data.Body.toString('utf8');
                const models = JSON.parse(content);
                this.didLoad(content);
                return models;
            })
                .catch((error) => {
                // First loading => no file => AccessDenied
                if (error.code === 'NotFound' || error.code === 'AccessDenied') {
                    return [];
                }
                throw error;
            });
            this.fromObject(models);
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(this.toObject(), null, 2);
            if (this.shouldSave(data)) {
                yield this.s3service.putObject({
                    Body: Buffer.from(data, 'utf8'),
                    Bucket: this.config.bucket,
                    Key: this.config.path
                })
                    .promise();
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
    static path(config) {
        return `s3:${config.bucket}:${config.path}`;
    }
}
/** @type {string} The pseudo path */
ModelsCollection.instances = [];
exports.ModelsCollection = ModelsCollection;
//# sourceMappingURL=ModelsCollection.js.map