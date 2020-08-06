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
exports.ProjectsCollection = void 0;
const typedi_1 = require("typedi");
const Project_1 = require("./Project");
const Projects_1 = require("../service/storage/api/Projects");
class ProjectsCollection {
    constructor() {
        /** The list of project instances */
        this.projects = [];
        this.storageService = typedi_1.Container.get(Projects_1.ProjectsApiStorageService);
    }
    /** Returns a singleton for this config */
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ProjectsCollection.instance) {
                // Create and load a new collection
                ProjectsCollection.instance = new ProjectsCollection();
                yield ProjectsCollection.instance.load();
            }
            return ProjectsCollection.instance;
        });
    }
    /** Load the projects */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromObject(yield this.storageService.list());
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to save
        });
    }
    /** Returns the list of projects */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.projects;
        });
    }
    /** Returns one project */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.projects.find((p) => p.id === id);
        });
    }
    /** Returns one project */
    add(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = yield this.storageService.create({
                name,
                description: description.length ? description : null,
            });
            return new Project_1.Project(object);
        });
    }
    fromObject(object) {
        this.projects = object.map((p) => new Project_1.Project(p));
        return this.projects;
    }
    toObject() {
        return this.projects.map((p) => p.toObject());
    }
}
exports.ProjectsCollection = ProjectsCollection;
//# sourceMappingURL=ProjectsCollection.js.map