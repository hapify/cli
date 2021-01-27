"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionService = void 0;
const typedi_1 = require("typedi");
let VersionService = class VersionService {
    constructor() {
        this.supportedVersions = {
            model: ['1', '2'],
            project: ['1', '2'],
            channel: ['1', '2'],
            preset: ['1', '2'],
        };
        this.currentVersions = {
            model: '2',
            project: '2',
            channel: '2',
            preset: '2',
        };
    }
    ensureVersionIsSupported(scope, version) {
        if (!this.supportedVersions[scope].includes(version)) {
            throw new Error(`Version ${version} of ${scope} is not supported. Supported versions are ${this.supportedVersions[scope].join(', ')}. Please upgrade your CLI or ${scope}.`);
        }
    }
    getCurrentVersion(scope) {
        return this.currentVersions[scope];
    }
};
VersionService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], VersionService);
exports.VersionService = VersionService;
//# sourceMappingURL=Version.js.map