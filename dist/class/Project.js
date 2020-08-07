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
            const path = this.localStorageService.resolve(value);
            if (!this.localStorageService.exists(path)) {
                throw new Error(`Invalid path "${value}" for project`);
            }
            this._id = path;
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
                const projectPayload = yield this.localStorageService.get(this._id);
                this.fromObject({
                    id: this._id,
                    created_at: Date.now(),
                    description: projectPayload.description,
                    name: projectPayload.name || this._id
                });
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