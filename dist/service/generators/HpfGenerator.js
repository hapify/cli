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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const hapify_syntax_1 = __importDefault(require("hapify-syntax"));
let HpfGeneratorService = class HpfGeneratorService {
    /**
     * Constructor
     */
    constructor() { }
    /**
     * @inheritDoc
     */
    one(model, template) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create template function
            const cleanedContent = yield this._preProcess(template.content);
            const content = hapify_syntax_1.default.run(cleanedContent, model);
            return yield this._postProcess(content);
        });
    }
    /**
     * @inheritDoc
     */
    all(models, template) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create template function
            const cleanedContent = yield this._preProcess(template.content);
            const content = hapify_syntax_1.default.run(cleanedContent, models);
            return yield this._postProcess(content);
        });
    }
    /**
     * Cleanup code before process
     *
     * @param {string} template
     * @return {Promise<string>}
     * @private
     */
    _preProcess(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const indentConditions = /^ +<<(\?|@|#)([\s\S]*?)>>/gm;
            return template.replace(indentConditions, '<<$1$2>>');
        });
    }
    /**
     * Cleanup code after process
     *
     * @param {string} code
     * @return {Promise<string>}
     * @private
     */
    _postProcess(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const doubleLine = /\r?\n\r?\n/g;
            while (code.match(doubleLine)) {
                code = code.replace(doubleLine, '\n');
            }
            const doubleLineWithSpace = /\r?\n *\r?\n/g;
            code = code.replace(doubleLineWithSpace, '\n\n');
            code = code.replace(doubleLineWithSpace, '\n\n');
            return code;
        });
    }
};
HpfGeneratorService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], HpfGeneratorService);
exports.HpfGeneratorService = HpfGeneratorService;
//# sourceMappingURL=HpfGenerator.js.map