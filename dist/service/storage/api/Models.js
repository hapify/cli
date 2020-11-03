"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ModelsApiStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelsApiStorageService = void 0;
const typedi_1 = require("typedi");
const Base_1 = require("./Base");
const md5_1 = __importDefault(require("md5"));
const Model_1 = require("../../../class/Model");
let ModelsApiStorageService = ModelsApiStorageService_1 = class ModelsApiStorageService extends Base_1.BaseApiStorageService {
    constructor() {
        super(...arguments);
        /** The models fingerprints */
        this.hashes = {};
    }
    /** Load the models from api for a specific project */
    forProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            const models = yield this.list({ project });
            this.updateHashes(models);
            return models;
        });
    }
    /** Send models to API if necessary */
    set(project, models) {
        return __awaiter(this, void 0, void 0, function* () {
            // Init map to match temp id to real id
            const referencesMap = {};
            // ========================================================
            // CREATION
            // Get models to create
            const toCreate = models.filter((m) => typeof this.hashes[m.id] === 'undefined');
            // Create models and update id
            for (const model of toCreate) {
                const response = yield this.create({
                    project: project,
                    name: model.name,
                    notes: model.notes || null,
                    fields: model.fields,
                    accesses: model.accesses,
                });
                referencesMap[model.id] = response.id;
                model.id = response.id;
            }
            // ========================================================
            // ========================================================
            // DELETION
            // Get models to delete
            const toDelete = Object.keys(this.hashes).filter((id) => !models.some((m) => m.id === id));
            // Delete models
            for (const id of toDelete) {
                yield this.remove(id);
                referencesMap[id] = null;
            }
            // ========================================================
            // ========================================================
            // UPDATE
            // Get models to update
            const toUpdate = models.filter((m) => typeof this.hashes[m.id] === 'string' && this.hashes[m.id] !== ModelsApiStorageService_1.hash(m));
            // Update models
            for (const model of toUpdate) {
                yield this.update(model.id, {
                    name: model.name,
                    notes: model.notes || null,
                    fields: model.fields,
                    accesses: model.accesses,
                });
            }
            // ========================================================
            // ========================================================
            // UPDATE REFERENCES
            /** Change references from temp id to real id and denotes if a change was made */
            const changeReferencesToNewModels = (m) => {
                let changed = false;
                for (const f of m.fields) {
                    if (f.type === 'entity' && typeof referencesMap[f.reference] !== 'undefined') {
                        f.reference = referencesMap[f.reference];
                        changed = true;
                    }
                }
                return changed;
            };
            // Parse all models and change references
            for (const model of models) {
                if (changeReferencesToNewModels(model)) {
                    yield this.update(model.id, {
                        fields: model.fields,
                    });
                }
            }
            // ========================================================
            this.updateHashes(models);
            // Return updated models
            return models;
        });
    }
    /** Update hashes from models */
    updateHashes(models) {
        this.hashes = {};
        for (const model of models) {
            this.hashes[model.id] = ModelsApiStorageService_1.hash(model);
        }
    }
    /** Create a hash for the model */
    static hash(model) {
        return md5_1.default(JSON.stringify(new Model_1.Model(model).toObject()));
    }
    defaultSearchParams() {
        const s = super.defaultSearchParams();
        s._limit = this.remoteConfig.modelsLimit;
        return s;
    }
    path() {
        return 'model';
    }
    fromApi(object) {
        return {
            id: object._id,
            name: object.name,
            notes: object.notes || null,
            fields: object.fields,
            accesses: object.accesses,
        };
    }
    requiresAuthentication() {
        return true;
    }
};
ModelsApiStorageService = ModelsApiStorageService_1 = __decorate([
    typedi_1.Service()
], ModelsApiStorageService);
exports.ModelsApiStorageService = ModelsApiStorageService;
//# sourceMappingURL=Models.js.map