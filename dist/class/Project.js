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
exports.Project = void 0;
const typedi_1 = require("typedi");
const Projects_1 = require("../service/storage/api/Projects");
const Project_1 = require("../service/storage/file/Project");
const Joi = __importStar(require("@hapi/joi"));
const Config_1 = require("../interface/schema/Config");
const ValidatorResult_1 = require("../interface/schema/ValidatorResult");
class Project {
    constructor(object) {
        this.remoteStorageService = typedi_1.Container.get(Projects_1.ProjectsApiStorageService);
        this.localStorageService = typedi_1.Container.get(Project_1.ProjectFileStorageService);
        if (object) {
            this.fromObject(object);
        }
    }
    get id() {
        return this._id;
    }
    set id(value) {
        // If the id is not a MongoDB Id, then it should be a file path
        if (Project.isMongoId(value)) {
            this._id = value;
            this._storageType = 'remote';
        }
        else {
            if (!this.localStorageService.exists(value)) {
                throw new Error(`Invalid path "${value}" for project`);
            }
            this._id = value;
            this._storageType = 'local';
        }
    }
    get storageType() {
        return this._storageType;
    }
    /** Returns a singleton for this config */
    static getInstance(project) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instances[project]) {
                this.instances[project] = new Project();
                this.instances[project].id = project;
                yield this.instances[project].load();
            }
            return this.instances[project];
        });
    }
    fromObject(object) {
        this.id = object.id;
        this.created_at = object.created_at;
        this.name = object.name;
        this.description = object.description;
        return this;
    }
    toObject() {
        return {
            id: this._id,
            created_at: this.created_at,
            name: this.name,
            description: this.description,
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.storageType === 'local') {
                // Validate config format
                const projectConfig = yield this.localStorageService.get(this._id);
                const validation = Joi.validate(projectConfig, Config_1.ProjectConfigSchema);
                if (validation.error) {
                    // Transform Joi message
                    ValidatorResult_1.TransformValidationMessage(validation.error);
                    throw validation.error;
                }
                this.fromObject(yield this.localStorageService.getProject(this._id));
            }
            else {
                this.fromObject(yield this.remoteStorageService.get(this._id));
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to save
        });
    }
    static isMongoId(value) {
        const regex = /^([a-f0-9]{24})$/i;
        return regex.exec(value) !== null;
    }
}
exports.Project = Project;
/** The loaded instances */
Project.instances = {};
//# sourceMappingURL=Project.js.map