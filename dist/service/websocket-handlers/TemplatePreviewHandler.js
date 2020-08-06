"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.TemplatePreviewHandlerService = void 0;
const typedi_1 = require("typedi");
const Channels_1 = require("../Channels");
const Generator_1 = require("../Generator");
const Joi = __importStar(require("joi"));
const Template_1 = require("../../interface/schema/Template");
const Template_2 = require("../../class/Template");
let TemplatePreviewHandlerService = class TemplatePreviewHandlerService {
    constructor(channelsService, generatorService) {
        this.channelsService = channelsService;
        this.generatorService = generatorService;
    }
    canHandle(message) {
        return message.id === 'prv:template';
    }
    validator() {
        return Joi.object({
            model: Joi.string(),
            channel: Joi.string().required(),
            template: Template_1.TemplateSchema.required(),
        });
    }
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get channel
            const channel = (yield this.channelsService.channels()).find((c) => c.id === message.data.channel);
            if (!channel) {
                throw new Error(`Unable to find channel ${message.data.channel}`);
            }
            // Get model, if any
            const model = message.data.model ? yield channel.modelsCollection.find(message.data.model) : null;
            // Get template
            const template = new Template_2.Template(channel, message.data.template);
            // Compute the path
            return this.generatorService.run(template, model);
        });
    }
};
TemplatePreviewHandlerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Channels_1.ChannelsService, Generator_1.GeneratorService])
], TemplatePreviewHandlerService);
exports.TemplatePreviewHandlerService = TemplatePreviewHandlerService;
//# sourceMappingURL=TemplatePreviewHandler.js.map