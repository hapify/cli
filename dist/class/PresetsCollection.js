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
class PresetsCollection {
    /**
     * Constructor
     * @param {IConfigPreset} config
     */
    constructor(config) {
        this.config = config;
        /** @type {Preset[]} The list of preset instances */
        this.presets = [];
        this.s3service = new S3({
            region: config.region,
            accessKeyId: config.key,
            secretAccessKey: config.secret
        });
        this.path = PresetsCollection.path(config);
    }
    /**
     * Returns a singleton for this config
     * @param {IConfigPreset} config
     */
    static getInstance(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = PresetsCollection.path(config);
            // Try to find an existing collection
            const presetsCollection = PresetsCollection.instances.find((m) => m.path === path);
            if (presetsCollection) {
                return presetsCollection;
            }
            // Create and load a new collection
            const collection = new PresetsCollection(config);
            yield collection.load();
            // Keep the collection
            PresetsCollection.instances.push(collection);
            return collection;
        });
    }
    /**
     * Load the preset from S3
     * @return {Promise<void>}
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Flush presets
                const presets = [];
                // List object
                const objects = (yield this.s3service.listObjects({
                    Bucket: this.config.bucket,
                    Prefix: this.config.path
                })
                    .promise()).Contents.filter((o) => o.Key.endsWith('.json'));
                objects.sort((a, b) => a.Key.localeCompare(b.Key));
                // Load objects
                for (const object of objects) {
                    const data = yield this.s3service.getObject({
                        Bucket: this.config.bucket,
                        Key: object.Key
                    })
                        .promise();
                    const content = data.Body.toString('utf8');
                    const preset = JSON.parse(content);
                    presets.push((new _1.Preset()).fromObject(preset));
                }
                this.fromObject(presets);
            }
            catch (error) {
                // First loading => no file => AccessDenied
                if (error.code === 'NotFound' || error.code === 'AccessDenied') {
                    return;
                }
                throw error;
            }
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
    /** @inheritDoc */
    fromObject(object) {
        this.presets = object.map((preset) => {
            const m = new _1.Preset();
            return m.fromObject(preset);
        });
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
    static path(config) {
        return `s3:${config.bucket}:${config.path}`;
    }
}
/** @type {string} The loaded instances */
PresetsCollection.instances = [];
exports.PresetsCollection = PresetsCollection;
//# sourceMappingURL=PresetsCollection.js.map