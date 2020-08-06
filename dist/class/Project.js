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
class Project {
    constructor(object) {
        if (object) {
            this.fromObject(object);
        }
        this.storageService = typedi_1.Container.get(Projects_1.ProjectsApiStorageService);
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
            id: this.id,
            created_at: this.created_at,
            name: this.name,
            description: this.description,
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromObject(yield this.storageService.get(this.id));
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to save
        });
    }
}
exports.Project = Project;
/** The loaded instances */
Project.instances = {};
//# sourceMappingURL=Project.js.map