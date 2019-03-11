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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const Options_1 = require("./Options");
class RichAxiosError {
    constructor(error) {
        this.name = 'RichAxiosError';
        this.stack = error.stack;
        this.config = error.config;
        this.code = error.code;
        this.request = error.request;
        this.response = error.response;
        // Get message and payload if possible
        if (error.response && error.response.data) {
            this.message = error.response.data.message;
            this.data = error.response.data.data;
        }
        else {
            this.message = error.message;
        }
    }
}
exports.RichAxiosError = RichAxiosError;
let ApiService = class ApiService {
    /** Constructor */
    constructor(optionsService) {
        this.optionsService = optionsService;
    }
    /** Create and get the http client */
    client() {
        if (!this.http) {
            this.http = axios_1.default.create({
                baseURL: this.optionsService.remoteConfig().uri,
                headers: {
                    'X-Api-Key': this.optionsService.apiKey()
                }
            });
        }
        return this.http;
    }
    /** Get */
    get(url, query, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client().get(this.query(url, query), config);
            }
            catch (e) {
                throw new RichAxiosError(e);
            }
        });
    }
    /** Post */
    post(url, payload, query, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client().post(this.query(url, query), payload, config);
            }
            catch (e) {
                throw new RichAxiosError(e);
            }
        });
    }
    /** Patch */
    patch(url, payload, query, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client().patch(this.query(url, query), payload, config);
            }
            catch (e) {
                throw new RichAxiosError(e);
            }
        });
    }
    /** Delete */
    delete(url, query, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client().delete(this.query(url, query), config);
            }
            catch (e) {
                throw new RichAxiosError(e);
            }
        });
    }
    /** Helper to return a stringified query */
    query(url, object) {
        return !!object ? `${url}?${querystring_1.default.stringify(object)}` : url;
    }
};
ApiService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Options_1.OptionsService])
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=Api.js.map