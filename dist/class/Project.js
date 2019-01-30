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
const service_1 = require("../service");
const typedi_1 = require("typedi");
class Project {
    /** Constructor */
    constructor(parent, object) {
        this.parent = parent;
        this.storageService = typedi_1.Container.get(service_1.ProjectApiStorageService);
        if (object) {
            this.fromObject(object);
        }
    }
    /** @inheritDoc */
    fromObject(object) {
        this.id = object.id;
        this.created_at = object.created_at;
        this.name = object.name;
        this.description = object.description;
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            created_at: this.created_at,
            name: this.name,
            description: this.description
        };
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromObject(yield this.storageService.get(this.parent.config.project));
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to save
        });
    }
}
exports.Project = Project;
//# sourceMappingURL=Project.js.map