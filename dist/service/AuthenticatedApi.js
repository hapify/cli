"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedApiService = void 0;
const typedi_1 = require("typedi");
const axios_1 = __importDefault(require("axios"));
const Api_1 = require("./Api");
let AuthenticatedApiService = class AuthenticatedApiService extends Api_1.ApiService {
    /** Create and get the http client */
    client() {
        if (!this.http) {
            this.http = axios_1.default.create({
                baseURL: this.optionsService.remoteConfig().uri,
                headers: {
                    'X-Api-Key': this.optionsService.apiKey(),
                },
            });
        }
        return this.http;
    }
};
AuthenticatedApiService = __decorate([
    typedi_1.Service()
], AuthenticatedApiService);
exports.AuthenticatedApiService = AuthenticatedApiService;
//# sourceMappingURL=AuthenticatedApi.js.map