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
exports.Project = void 0;
const typedi_1 = require("typedi");
const Projects_1 = require("../service/storage/api/Projects");
const Project_1 = require("../service/storage/file/Project");
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
        if (Project.isRemoteId(value)) {
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
            const key = 'ProjectSingletons';
            const instances = typedi_1.Container.has(key) ? typedi_1.Container.get(key) : {};
            if (!instances[project]) {
                instances[project] = new Project();
                instances[project].id = project;
                yield instances[project].load();
                typedi_1.Container.set(key, instances);
            }
            return instances[project];
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
                const validation = Config_1.ProjectConfigSchema.validate(projectConfig);
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
            if (this.storageType === 'local') {
                yield this.localStorageService.setProject(this._id, this.toObject());
            }
            else {
                yield this.remoteStorageService.update(this._id, {
                    name: this.name,
                    description: this.description,
                });
            }
        });
    }
    static createLocalForChannel(channel, name = 'My project', description = 'A new Hapify project') {
        return __awaiter(this, void 0, void 0, function* () {
            yield typedi_1.Container.get(Project_1.ProjectFileStorageService).setProject(channel.guessProjectIdOrPath(), {
                id: channel.config.project,
                name,
                description,
            }, []);
        });
    }
    static isRemoteId(value) {
        const regex = /^([a-f0-9]{24})$/i; // MongoId
        return regex.exec(value) !== null;
    }
    setNameAndDescription(name, description = null) {
        this.name = name;
        this.description = description;
    }
}
exports.Project = Project;
//# sourceMappingURL=Project.js.map