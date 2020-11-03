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
exports.BaseApiStorageService = void 0;
const typedi_1 = require("typedi");
const Options_1 = require("../../Options");
const Api_1 = require("../../Api");
const AuthenticatedApi_1 = require("../../AuthenticatedApi");
let BaseApiStorageService = 
/**
 * T: Internal interface
 * I: Api Interface
 * S: Search params
 */
class BaseApiStorageService {
    constructor(optionsService) {
        this.optionsService = optionsService;
        this.apiService = this.requiresAuthentication() ? typedi_1.Container.get(AuthenticatedApi_1.AuthenticatedApiService) : typedi_1.Container.get(Api_1.ApiService);
        this.remoteConfig = optionsService.remoteConfig();
    }
    /** Create a new model */
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = (yield this.apiService.post(`${this.path()}`, payload)).data;
            return this.fromApi(output);
        });
    }
    /** Update an model selected from it's id */
    update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.patch(`${this.path()}/${id}`, payload);
        });
    }
    /** Get an model from it's id */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = (yield this.apiService.get(`${this.path()}/${id}`)).data;
            return this.fromApi(output);
        });
    }
    /** Delete an model selected from it's id */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.delete(`${this.path()}/${id}`);
        });
    }
    /** Get list for model search */
    list(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = (yield this.apiService.get(`${this.path()}`, Object.assign(this.defaultSearchParams(), searchParams))).data.items;
            return output.map((o) => this.fromApi(o));
        });
    }
    /** Count for model */
    count(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove unwanted properties
            const params = Object.assign({}, this.defaultSearchParams(), searchParams);
            delete params._page;
            delete params._limit;
            delete params._order;
            delete params._sort;
            return (yield this.apiService.get(`${this.path()}/count`, Object.assign(this.defaultSearchParams(), searchParams))).data.total;
        });
    }
    /** Get the default search params (limit, page, etc...) */
    defaultSearchParams() {
        return {
            _page: 0,
            _limit: 20,
        };
    }
};
BaseApiStorageService = __decorate([
    typedi_1.Service()
    /**
     * T: Internal interface
     * I: Api Interface
     * S: Search params
     */
    ,
    __metadata("design:paramtypes", [Options_1.OptionsService])
], BaseApiStorageService);
exports.BaseApiStorageService = BaseApiStorageService;
//# sourceMappingURL=Base.js.map