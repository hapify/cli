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
let GeneratorService = class GeneratorService {
    /** Constructor */
    constructor() {
    }
    /** Load and returns API Service. Avoid circular dependency */
    api() {
        if (typeof this.apiService === 'undefined') {
            this.apiService = typedi_1.Container.get(Api_1.ApiService);
        }
        return this.apiService;
    }
    /**
     * Compile for a whole channel
     * @param {Channel} channel
     * @returns {Promise<IGeneratorResult[]>}
     */
    runChannel(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api().post('generator/run', {
                project: channel.config.project,
                templates: channel.templates.map(t => t.toObject())
            });
            return response.data;
        });
    }
    /**
     * Compile a template to multiple files.
     * One per model, if applicable.
     *
     * @param {Template} template
     * @returns {Promise<IGeneratorResult[]>}
     */
    runTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api().post('generator/run', {
                project: template.channel().config.project,
                templates: [template.toObject()]
            });
            return response.data;
        });
    }
    /**
     * Run generation process for one model
     *
     * @param {Template} template
     * @param {Model|null} model
     * @returns {Promise<IGeneratorResult>}
     * @throws {Error}
     *  If the template needs a model and no model is passed
     */
    run(template, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (template.needsModel() && !model) {
                throw new Error('Model should be defined for this template');
            }
            const payload = {
                project: template.channel().config.project,
                templates: [template.toObject()]
            };
            if (model) {
                payload.ids = [model.id];
            }
            return (yield this.api().post('generator/run', payload)).data[0];
        });
    }
    /**
     * Compute path from a string
     *
     * @param {string} path
     * @param {Model|null} model
     *  Default null
     * @returns {string}
     */
    pathPreview(path, model = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = model ? { path, model: model.id } : { path };
            return (yield this.api().post('generator/path', payload)).data.result;
        });
    }
};
GeneratorService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], GeneratorService);
exports.GeneratorService = GeneratorService;
//# sourceMappingURL=Generator.js.map