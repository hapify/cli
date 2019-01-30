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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const Api_1 = require("./Api");
const Channels_1 = require("./Channels");
let InfoService = class InfoService {
    /** Constructor */
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    /** Load and returns API Service. Avoid circular dependency */
    api() {
        if (typeof this.apiService === 'undefined') {
            this.apiService = typedi_1.Container.get(Api_1.ApiService);
        }
        return this.apiService;
    }
    /** Get the project once and returns it */
    project() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._project) {
                const channel = (yield this.channelsService.channels())[0];
                this._project = (yield this.api().get(`project/${channel.config.project}`)).data;
            }
            return this._project;
        });
    }
    /** Get the limits once and returns them */
    limits() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._limits) {
                this._limits = (yield this.api().get('generator/limits')).data;
            }
            return this._limits;
        });
    }
    /** Get the default model field from channel */
    fields() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._fields) {
                // Get defined fields
                const channels = yield this.channelsService.channels();
                const channel = channels.find(c => !!c.config.defaultFields);
                this._fields = channel ? channel.config.defaultFields : [];
            }
            return this._fields;
        });
    }
};
InfoService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Channels_1.ChannelsService])
], InfoService);
exports.InfoService = InfoService;
//# sourceMappingURL=Info.js.map