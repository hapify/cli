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
exports.PathPreviewHandlerService = void 0;
const typedi_1 = require("typedi");
const Channels_1 = require("../Channels");
const Generator_1 = require("../Generator");
const joi_1 = __importDefault(require("joi"));
let PathPreviewHandlerService = class PathPreviewHandlerService {
    constructor(channelsService, generatorService) {
        this.channelsService = channelsService;
        this.generatorService = generatorService;
    }
    canHandle(message) {
        return message.id === 'prv:path';
    }
    validator() {
        return joi_1.default.object({
            model: joi_1.default.string(),
            path: joi_1.default.string().required(),
        });
    }
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get model, if any
            const model = message.data.model ? yield (yield this.channelsService.modelsCollection()).find(message.data.model) : null;
            // Compute the path
            return yield this.generatorService.pathPreview(message.data.path, model);
        });
    }
};
PathPreviewHandlerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Channels_1.ChannelsService, Generator_1.GeneratorService])
], PathPreviewHandlerService);
exports.PathPreviewHandlerService = PathPreviewHandlerService;
//# sourceMappingURL=PathPreviewHandler.js.map