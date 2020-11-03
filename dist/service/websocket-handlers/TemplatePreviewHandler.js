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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatePreviewHandlerService = void 0;
const typedi_1 = require("typedi");
const Channels_1 = require("../Channels");
const Generator_1 = require("../Generator");
const joi_1 = __importDefault(require("joi"));
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
        return joi_1.default.object({
            model: joi_1.default.string(),
            channel: joi_1.default.string().required(),
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