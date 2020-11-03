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
exports.ValidateModelHandlerService = void 0;
const typedi_1 = require("typedi");
const Validator_1 = require("../Validator");
const joi_1 = __importDefault(require("joi"));
const Model_1 = require("../../interface/schema/Model");
let ValidateModelHandlerService = class ValidateModelHandlerService {
    constructor(validatorService) {
        this.validatorService = validatorService;
    }
    canHandle(message) {
        return message.id === 'val:model';
    }
    validator() {
        return joi_1.default.object({
            model: Model_1.ModelSchema,
            content: joi_1.default.string().required(),
        });
    }
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