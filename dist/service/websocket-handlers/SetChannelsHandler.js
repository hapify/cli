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
exports.SetChannelsHandlerService = void 0;
const typedi_1 = require("typedi");
const Channels_1 = require("../Channels");
const joi_1 = __importDefault(require("joi"));
const Channel_1 = require("../../interface/schema/Channel");
let SetChannelsHandlerService = class SetChannelsHandlerService {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    canHandle(message) {
        return message.id === 'set:channels';
    }
    validator() {
        return joi_1.default.array().items(Channel_1.ChannelSchema).min(0);
    }
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