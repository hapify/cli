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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const interface_1 = require("../../interface");
const Presets_1 = require("../Presets");
const Joi = __importStar(require("joi"));
const class_1 = require("../../class");
let ApplyPresetHandlerService = class ApplyPresetHandlerService {
    /**
     * Constructor
     * @param presetsService
     */
    constructor(presetsService) {
        this.presetsService = presetsService;
    }
    /** @inheritDoc */
    canHandle(message) {
        return message.id === interface_1.WebSocketMessages.APPLY_PRESETS;
    }
    /** @inheritDoc */
    validator() {
        return Joi.object({
            models: Joi.array()
                .items(interface_1.ModelSchema)
                .required()
                .min(0)
        });
    }
    /** @inheritDoc */
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const models = message.data.models.map(m => {
                const model = new class_1.Model();
                model.fromObject(m);
                return model;
            });
            const results = yield this.presetsService.apply(models);
            return {
                updated: results.updated.map(m => m.toObject()),
                created: results.created.map(m => m.toObject())
            };
        });
    }
};
ApplyPresetHandlerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Presets_1.PresetsService])
], ApplyPresetHandlerService);
exports.ApplyPresetHandlerService = ApplyPresetHandlerService;
//# sourceMappingURL=ApplyPresetHandler.js.map