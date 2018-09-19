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
const enum_1 = require("../enum");
class Template {
    /**
     * Constructor
     * @param {Channel} parent
     */
    constructor(parent) {
        this.parent = parent;
    }
    /** @inheritDoc */
    fromObject(object) {
        this.name = object.name;
        this.path = object.path;
        this.engine = object.engine;
        this.input = object.input;
        this.contentPath = object.contentPath;
        this.content = object.content;
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            name: this.name,
            path: this.path,
            engine: this.engine,
            input: this.input,
            contentPath: this.contentPath,
            content: this.content
        };
    }
    /**
     * Denotes if the template should be considered as empty
     * @returns {boolean}
     */
    isEmpty() {
        return typeof this.content !== 'string'
            || this.content === null
            || this.content.trim().length === 0;
    }
    /**
     * Denotes if the template needs a specific model to be generated
     * @returns {boolean}
     */
    needsModel() {
        return this.input === enum_1.TemplateInput.One;
    }
    /**
     * Get the extension of the input file
     * @returns {string}
     */
    extension() {
        if (this.engine === enum_1.TemplateEngine.Hpf) {
            return 'hpf';
        }
        else if (this.engine === enum_1.TemplateEngine.doT) {
            return 'dot';
        }
        return 'js';
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentPath = `${this.parent.path}/${this.contentPath}`;
            this.content = Fs.readFileSync(contentPath, 'utf8');
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentPath = `${this.parent.path}/${this.contentPath}`;
            Fs.writeFileSync(contentPath, this.content, 'utf8');
        });
    }
}
exports.Template = Template;
//# sourceMappingURL=Template.js.map