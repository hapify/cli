"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ModelsApiStorageService_1;
const md5_1 = __importDefault(require("md5"));
const typedi_1 = require("typedi");
const config_1 = require("../../../config");
const Api_1 = require("../../Api");
const class_1 = require("../../../class");
let ModelsApiStorageService = ModelsApiStorageService_1 = class ModelsApiStorageService {
    /** Constructor */
    constructor(apiService) {
        this.apiService = apiService;
        /** The models fingerprints */
        this.hashes = {};
    }
    /** Load the models from api */
    list(project) {
        return __awaiter(this, void 0, void 0, function* () {
            const models = yield yield this.apiService
                .get('model', {
                _page: 0,
                _limit: config_1.ConfigRemote.modelsLimit,
                project: project
            })
                .then(response => {
                return response.data.items.map((m) => ({
                    id: m._id,
                    name: m.name,
                    fields: m.fields,
                    accesses: m.accesses
                }));
            });
            this.updateHashes(models);
            return models;
        });
    }
    /** Send models to API if necessary */
    set(project, models) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get models to create
            const toCreate = models.filter(m => typeof this.hashes[m.id] === 'undefined');
            // Create models and update id
            for (const model of toCreate) {
                const response = yield this.apiService.post('model', {
                    project: project,
                    name: model.name,
                    fields: model.fields,
                    accesses: model.accesses
                });
                model.id = response.data._id;
            }
            // Get models to update
            const toUpdate = models.filter(m => typeof this.hashes[m.id] === 'string' &&
                this.hashes[m.id] !== ModelsApiStorageService_1.hash(m));
            // Update models
            for (const model of toUpdate) {
                yield this.apiService.patch(`model/${model.id}`, {
                    name: model.name,
                    fields: model.fields,
                    accesses: model.accesses
                });
            }
            // Get models to delete
            const toDelete = Object.keys(this.hashes).filter(id => !models.some(m => m.id === id));
            // Delete models
            for (const id of toDelete) {
                yield this.apiService.delete(`model/${id}`);
            }
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
        return md5_1.default(JSON.stringify(new class_1.Model(model).toObject()));
    }
};
ModelsApiStorageService = ModelsApiStorageService_1 = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Api_1.ApiService])
], ModelsApiStorageService);
exports.ModelsApiStorageService = ModelsApiStorageService;
//# sourceMappingURL=Models.js.map