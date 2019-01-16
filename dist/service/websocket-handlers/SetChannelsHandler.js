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
const Channels_1 = require("../Channels");
const Joi = __importStar(require("joi"));
let SetChannelsHandlerService = class SetChannelsHandlerService {
    /**
     * Constructor
     * @param channelsService
     */
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    /** @inheritDoc */
    canHandle(message) {
        return message.id === interface_1.WebSocketMessages.SET_CHANNELS;
    }
    /** @inheritDoc */
    validator() {
        return Joi.array().items(Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            description: Joi.string().required().allow(null),
            logo: Joi.string().required().allow(null),
            validator: Joi.string().required().allow(''),
            templates: Joi.array().items(Joi.object({
                name: Joi.string().required(),
                path: Joi.string().required(),
                engine: Joi.string().required(),
                input: Joi.string().required(),
                content: Joi.string().required().allow('')
            })).required()
        })).min(0);
    }
    /** @inheritDoc */
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Existing channels
            const channels = yield this.channelsService.channels();
            // New contents
            const toSaves = message.data;
            // For each new content, get the corresponding channel and save it
            for (const toSave of toSaves) {
                const channel = channels.find((c) => c.id === toSave.id);
                // Scream if not found
                if (!channel) {
                    throw new Error(`Channel not found: ${toSave.name}`);
                }
                channel.fromObject(toSave);
                yield channel.save();
            }
        });
    }
};
SetChannelsHandlerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Channels_1.ChannelsService])
], SetChannelsHandlerService);
exports.SetChannelsHandlerService = SetChannelsHandlerService;
//# sourceMappingURL=SetChannelsHandler.js.map