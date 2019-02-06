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
const _1 = require("./");
const service_1 = require("../service");
const typedi_1 = require("typedi");
class ProjectsCollection {
    /** Constructor */
    constructor() {
        /** @type {Project[]} The list of project instances */
        this.projects = [];
        this.storageService = typedi_1.Container.get(service_1.ProjectsApiStorageService);
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
    /**
     * Load the projects
     * @return {Promise<void>}
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromObject(yield this.storageService.list());
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to save
        });
    }
    /**
     * Returns the list of projects
     * @returns {Promise<Project[]>}
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.projects;
        });
    }
    /**
     * Returns one project
     * @returns {Promise<Project>}
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.projects.find(p => p.id === id);
        });
    }
    /**
     * Returns one project
     * @returns {Promise<Project>}
     */
    add(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = yield this.storageService.create({
                name,
                description: description.length ? description : null
            });
            return new _1.Project(object);
        });
    }
    /** @inheritDoc */
    fromObject(object) {
        this.projects = object.map(p => new _1.Project(p));
        return this.projects;
    }
    /** @inheritDoc */
    toObject() {
        return this.projects.map(p => p.toObject());
    }
}
exports.ProjectsCollection = ProjectsCollection;
//# sourceMappingURL=ProjectsCollection.js.map