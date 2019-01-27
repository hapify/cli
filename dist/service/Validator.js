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
const interface_1 = require("../interface");
const config_1 = require("../config");
const ErrorStackParser = __importStar(require("error-stack-parser"));
const class_1 = require("../class");
const { SaferEval } = require('safer-eval');
const Joi = __importStar(require("joi"));
let ValidatorService = class ValidatorService {
    /**
     * Constructor
     */
    constructor() {
    }
    /**
     * Run validation on a single model for a single channel
     *
     * @param {string} content
     * @param {IModel} model
     * @return {Promise<IValidatorResult>}
     */
    run(content, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const final = `(function() { \n${content}\n })()`;
                const result = new SaferEval({ model }, {
                    filename: 'js-validator.js',
                    timeout: config_1.ConfigInternal.validatorTimeout,
                    lineOffset: -1,
                    contextCodeGeneration: {
                        strings: false,
                        wasm: false,
                    }
                }).runInContext(final);
                const validation = Joi.validate(result, interface_1.ValidatorResultSchema);
                if (validation.error) {
                    const original = interface_1.TransformValidationMessage(validation.error).message;
                    throw new class_1.RichError(`Invalid validator output. Must return { errors: string[], warnings: string[] } [${original}]`, {
                        code: 4007,
                        type: 'ConsoleValidatorOutputError'
                    });
                }
            }
            catch (error) {
                if (error.message === 'Script execution timed out.') {
                    throw new class_1.RichError(`Template processing timed out (${config_1.ConfigInternal.validatorTimeout}ms)`, {
                        code: 4006,
                        type: 'ConsoleValidatorTimeoutError'
                    });
                }
                // Format error
                const { lineNumber, columnNumber } = ErrorStackParser.parse(error)[0];
                throw new class_1.RichError(error.message, {
                    code: 4005,
                    type: 'ConsoleValidatorEvaluationError',
                    details: `Error: ${error.message}. Line: ${lineNumber}, Column: ${columnNumber}`,
                    lineNumber,
                    columnNumber
                });
            }
        });
    }
};
ValidatorService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], ValidatorService);
exports.ValidatorService = ValidatorService;
//# sourceMappingURL=Validator.js.map