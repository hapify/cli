"use strict";
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
const Fs = __importStar(require("fs"));
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
            const contentPath = `${this.parent.path}/${this.path}`;
            this.content = Fs.readFileSync(contentPath, 'utf8');
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentPath = `${this.parent.path}/${this.path}`;
            Fs.writeFileSync(contentPath, this.content, 'utf8');
        });
    }
    /**
     * Denotes if the validator should be considered as empty
     * @returns {boolean}
     */
    isEmpty() {
        return typeof this.content !== 'string'
            || this.content === null
            || this.content.trim().length === 0;
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map