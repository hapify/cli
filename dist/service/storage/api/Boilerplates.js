"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoilerplatesApiStorageService = void 0;
const typedi_1 = require("typedi");
const Base_1 = require("./Base");
let BoilerplatesApiStorageService = class BoilerplatesApiStorageService extends Base_1.BaseApiStorageService {
    defaultSearchParams() {
        const s = super.defaultSearchParams();
        s._limit = this.remoteConfig.boilerplatesLimit;
        return s;
    }
    path() {
        return 'boilerplate';
    }
    fromApi(object) {
        return {
            id: object._id,
            slug: object.slug,
            name: object.name,
            git_url: object.git_url,
        };
    }
    requiresAuthentication() {
        return false;
    }
};
BoilerplatesApiStorageService = __decorate([
    typedi_1.Service()
], BoilerplatesApiStorageService);
exports.BoilerplatesApiStorageService = BoilerplatesApiStorageService;
//# sourceMappingURL=Boilerplates.js.map