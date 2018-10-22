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
const __1 = require("../");
const Joi = __importStar(require("joi"));
const IObjects_1 = require("../../interface/IObjects");
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
    validator() {
        const accesses = [IObjects_1.Access.ADMIN, IObjects_1.Access.OWNER, IObjects_1.Access.AUTHENTICATED, IObjects_1.Access.GUEST];
        return Joi.array().items(Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            fields: Joi.array().items(Joi.object({
                name: Joi.string().required(),
                type: Joi.string().required(),
                subtype: Joi.string().required().allow(null),
                reference: Joi.string().required().allow(null),
                primary: Joi.boolean().required(),
                unique: Joi.boolean().required(),
                label: Joi.boolean().required(),
                nullable: Joi.boolean().required(),
                multiple: Joi.boolean().required(),
                searchable: Joi.boolean().required(),
                sortable: Joi.boolean().required(),
                isPrivate: Joi.boolean().required(),
                internal: Joi.boolean().required(),
                important: Joi.boolean().required(),
            })).required().min(1),
            accesses: Joi.object({
                create: Joi.string().valid(accesses).required(),
                read: Joi.string().valid(accesses).required(),
                update: Joi.string().valid(accesses).required(),
                remove: Joi.string().valid(accesses).required(),
                search: Joi.string().valid(accesses).required(),
                count: Joi.string().valid(accesses).required(),
            })
        })).min(1);
    }
    /** @inheritDoc */
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelsCollection = yield this.channelsService.modelsCollection();
            modelsCollection.fromObject(message.data);
            yield modelsCollection.save();
        });
    }
};
SetModelsHandlerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [__1.ChannelsService])
], SetModelsHandlerService);
exports.SetModelsHandlerService = SetModelsHandlerService;
//# sourceMappingURL=SetModelsHandler.js.map