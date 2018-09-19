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
const interface_1 = require("../../interface");
const __1 = require("../");
let SetModelsHandlerService = class SetModelsHandlerService {
    /**
     * Constructor
     * @param channelsService
     */
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    /** @inheritDoc */
    canHandle(message) {
        return message.id === interface_1.WebSocketMessages.SET_MODELS;
    }
    /** @inheritDoc */
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelsCollection = yield this.channelsService.modelsCollection();
            modelsCollection.fromObject(message.data);
            modelsCollection.save();
        });
    }
};
SetModelsHandlerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [__1.ChannelsService])
], SetModelsHandlerService);
exports.SetModelsHandlerService = SetModelsHandlerService;
//# sourceMappingURL=SetModelsHandler.js.map