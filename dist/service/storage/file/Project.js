"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFileStorageService = void 0;
const typedi_1 = require("typedi");
const SingleSave_1 = require("./SingleSave");
const Path = __importStar(require("path"));
let ProjectFileStorageService = class ProjectFileStorageService extends SingleSave_1.SingleSaveFileStorage {
    constructor() {
        super(...arguments);
        this.booleanPropertiesNames = [
            'primary',
            'unique',
            'label',
            'nullable',
            'multiple',
            'embedded',
            'searchable',
            'sortable',
            'hidden',
            'internal',
            'restricted',
            'ownership',
        ];
    }
    serialize(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const compact = {
                version: content.version,
                name: content.name || undefined,
                description: content.description || undefined,
                models: content.models.map((model) => {
                    return {
                        id: model.id,
                        name: model.name,
                        accesses: model.accesses,
                        fields: model.fields.map((field) => {
                            return {
                                name: field.name,
                                type: field.type,
                                subtype: field.subtype || undefined,
                                reference: field.reference || undefined,
                                properties: this.booleanPropertiesNames
                                    .map((property) => {
                                    return field[property] ? property : null;
                                })
                                    .filter((p) => !!p),
                                notes: field.notes || undefined,
                            };
                        }),
                        notes: model.notes || undefined,
                    };
                }),
            };
            return JSON.stringify(compact, null, 2);
        });
    }
    deserialize(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const compact = JSON.parse(content);
                return {
                    version: compact.version,
                    name: compact.name || null,
                    description: compact.description || null,
                    models: compact.models.map((model) => {
                        return {
                            id: model.id,
                            name: model.name,
                            accesses: model.accesses,
                            fields: model.fields.map((field) => {
                                return {
                                    name: field.name,
                                    type: field.type,
                                    subtype: field.subtype || null,
                                    reference: field.reference || null,
                                    primary: field.properties.includes('primary'),
                                    unique: field.properties.includes('unique'),
                                    label: field.properties.includes('label'),
                                    nullable: field.properties.includes('nullable'),
                                    multiple: field.properties.includes('multiple'),
                                    embedded: field.properties.includes('embedded'),
                                    searchable: field.properties.includes('searchable'),
                                    sortable: field.properties.includes('sortable'),
                                    hidden: field.properties.includes('hidden'),
                                    internal: field.properties.includes('internal'),
                                    restricted: field.properties.includes('restricted'),
                                    ownership: field.properties.includes('ownership'),
                                    notes: field.notes || null,
                                };
                            }),
                            notes: model.notes || null,
                        };
                    }),
                };
            }
            catch (error) {
                throw new Error(`An error occurred while parsing Project configuration: ${error.toString()}`);
            }
        });
    }
    getProject(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectConfig = yield this.get(path);
            return {
                id: path,
                created_at: Date.now(),
                description: projectConfig.description,
                name: projectConfig.name || Path.basename(Path.dirname(path)),
            };
        });
    }
    getModels(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.get(path);
            return project.models;
        });
    }
    setModels(path, models) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.get(path);
            project.models = models;
            yield this.set(path, project);
        });
    }
};
ProjectFileStorageService = __decorate([
    typedi_1.Service()
], ProjectFileStorageService);
exports.ProjectFileStorageService = ProjectFileStorageService;
//# sourceMappingURL=Project.js.map