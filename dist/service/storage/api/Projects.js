"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const Base_1 = require("./Base");
const config_1 = require("../../../config");
let ProjectsApiStorageService = class ProjectsApiStorageService extends Base_1.BaseApiStorageService {
    /** @inheritDoc */
    defaultSearchParams() {
        const s = super.defaultSearchParams();
        s._limit = config_1.ConfigRemote.projectsLimit;
        return s;
    }
    /** @inheritDoc */
    path() {
        return 'project';
    }
    /** @inheritDoc */
    fromApi(object) {
        return {
            id: object._id,
            created_at: object.created_at,
            name: object.name,
            description: object.description
        };
    }
    /** @inheritDoc */
    toApi(object) {
        return {
            name: object.name,
            description: object.description
        };
    }
};
ProjectsApiStorageService = __decorate([
    typedi_1.Service()
], ProjectsApiStorageService);
exports.ProjectsApiStorageService = ProjectsApiStorageService;
//# sourceMappingURL=Projects.js.map