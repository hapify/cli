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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorService = void 0;
const typedi_1 = require("typedi");
const vm_1 = require("@hapify/vm");
const Internal_1 = require("../config/Internal");
const RichError_1 = require("../class/RichError");
const ValidatorResult_1 = require("../interface/schema/ValidatorResult");
let ValidatorService = class ValidatorService {
    constructor() { }
    /**
     * Run validation on a single model for a single channel
     *
     */
    run(content, model) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            // Try or die
            try {
                result = new vm_1.HapifyVM({
                    timeout: Internal_1.InternalConfig.validatorTimeout,
                    allowAnyOutput: true,
                }).run(content, { model });
            }
            catch (error) {
                if (error.code === 6003) {
                    throw new RichError_1.RichError(`Template processing timed out (${Internal_1.InternalConfig.validatorTimeout}ms)`, {
                        code: 4006,
                        type: 'CliValidatorTimeoutError',
                    });
                }
                if (error.code === 6002) {
                    // Clone error
                    const { lineNumber, columnNumber } = error;
                    throw new RichError_1.RichError(error.message, {
                        code: 4005,
                        type: 'CliValidatorEvaluationError',
                        details: `Error: ${error.message}. Line: ${lineNumber}, Column: ${columnNumber}`,
                        lineNumber,
                        columnNumber,
                    });
                }
                if (error.code === 6004) {
                    // Clone error
                    throw new RichError_1.RichError(error.message, {
                        code: error.code,
                        type: error.name,
                    });
                }
                throw error;
            }
            // Check result and return
            const validation = ValidatorResult_1.ValidatorResultSchema.validate(result);
            if (validation.error) {
                throw new RichError_1.RichError(`Invalid validator output. Must return { errors: string[], warnings: string[] }`, {
                    code: 4007,
                    type: 'CliValidatorOutputError',
                });
            }
            return result;
        });
    }
};
ValidatorService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], ValidatorService);
exports.ValidatorService = ValidatorService;
//# sourceMappingURL=Validator.js.map