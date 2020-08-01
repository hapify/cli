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
exports.ValidateModelHandlerService = void 0;
const typedi_1 = require("typedi");
const Validator_1 = require("../Validator");
const Joi = __importStar(require("joi"));
const IWebSocketMessage_1 = require("../../interface/IWebSocketMessage");
const Model_1 = require("../../interface/schema/Model");
let ValidateModelHandlerService = class ValidateModelHandlerService {
    /**
     * Constructor
     * @param validatorService
     */
    constructor(validatorService) {
        this.validatorService = validatorService;
    }
    /** @inheritDoc */
    canHandle(message) {
        return message.id === IWebSocketMessage_1.WebSocketMessages.VALIDATE_MODEL;
    }
    /** @inheritDoc */
    validator() {
        return Joi.object({
            model: Model_1.ModelSchema,
            content: Joi.string().required(),
        });
    }
    /** @inheritDoc */
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // From content
            return yield this.validatorService.run(message.data.content, message.data.model);
        });
    }
};
ValidateModelHandlerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Validator_1.ValidatorService])
], ValidateModelHandlerService);
exports.ValidateModelHandlerService = ValidateModelHandlerService;
//# sourceMappingURL=ValidateModelHandler.js.map