"use strict";
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
exports.Validator = void 0;
const service_1 = require("../service");
const typedi_1 = require("typedi");
class Validator {
    /**
     * Constructor
     * @param {Channel} parent
     * @param {string} path
     */
    constructor(parent, path) {
        this.parent = parent;
        this.path = path;
        this.storageService = typedi_1.Container.get(service_1.ValidatorFileStorageService);
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate();
            this.content = yield this.storageService.get([
                this.parent.path,
                this.path
            ]);
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.set([this.parent.path, this.path], this.content);
        });
    }
    /**
     * Check resource validity
     * @throws {Error}
     */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.storageService.exists([this.parent.path, this.path]))) {
                throw new Error(`Validator's path ${this.parent.path}/${this.path} does not exists.`);
            }
        });
    }
    /**
     * Denotes if the validator should be considered as empty
     * @returns {boolean}
     */
    isEmpty() {
        return (typeof this.content !== 'string' || this.content.trim().length === 0);
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map