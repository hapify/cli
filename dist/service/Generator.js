"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.GeneratorService = void 0;
const typedi_1 = require("typedi");
const generator_1 = require("@hapify/generator");
let GeneratorService = class GeneratorService {
    /** Compile for a whole channel */
    runChannel(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const models = yield channel.modelsCollection.list();
            return yield generator_1.Generator.run(channel.templates, models);
        });
    }
    /**
     * Compile a template to multiple files.
     * One per model, if applicable.
     */
    runTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const models = yield template.channel().modelsCollection.list();
            return yield generator_1.Generator.run([template], models);
        });
    }
    /**
     * Run generation process for one template/model
     * @throws {Error} If the template needs a model and no model is passed
     */
    run(template, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (template.needsModel() && !model) {
                throw new Error('Model should be defined for this template');
            }
            const models = yield template.channel().modelsCollection.list();
            const result = yield generator_1.Generator.run([template], models, model ? [model.id] : null);
            return result[0];
        });
    }
    /** Compute path from a string */
    pathPreview(path, model = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return generator_1.Generator.path(path, model ? model.name : null);
        });
    }
};
GeneratorService = __decorate([
    typedi_1.Service()
], GeneratorService);
exports.GeneratorService = GeneratorService;
//# sourceMappingURL=Generator.js.map