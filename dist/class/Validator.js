"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Validator {
    /**
     * Constructor
     * @param {Channel} parent
     * @param {string} path
     */
    constructor(parent, path) {
        this.parent = parent;
        this.path = path;
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
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
     * Denotes if the validator should be considered as empty
     * @returns {boolean}
     */
    isEmpty() {
        return (typeof this.content !== 'string' || this.content.trim().length === 0);
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map