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
exports.Template = void 0;
const typedi_1 = require("typedi");
const Template_1 = require("../service/storage/file/Template");
const String_1 = require("../service/String");
class Template {
    constructor(parent, object) {
        this.parent = parent;
        this.storageService = typedi_1.Container.get(Template_1.TemplatesFileStorageService);
        if (object) {
            this.fromObject(object);
        }
    }
    fromObject(object) {
        this.path = object.path;
        this.engine = object.engine;
        this.input = object.input;
        this.content = object.content;
        this.contentPath = Template.computeContentPath(this);
        this.legacyContentPaths = [Template.computeContentPathV1(this)];
        return this;
    }
    toObject() {
        return {
            path: this.path,
            engine: this.engine,
            input: this.input,
            content: this.content,
        };
    }
    /** Denotes if the template should be considered as empty */
    isEmpty() {
        return typeof this.content !== 'string' || this.content.trim().length === 0;
    }
    /** Denotes if the template needs a specific model to be generated */
    needsModel() {
        return this.input === 'one';
    }
    /** Get the extension of the input file */
    extension() {
        return Template.computeExtension(this);
    }
    /** Get the parent channel */
    channel() {
        return this.parent;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentPath = this.findContentPath();
            this.content = yield this.storageService.get([this.parent.templatesPath, contentPath]);
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.set([this.parent.templatesPath, this.contentPath], this.content);
        });
    }
    findContentPath() {
        const possiblePaths = [this.contentPath, ...(this.legacyContentPaths || [])];
        const existingPath = possiblePaths.find((path) => this.storageService.exists([this.parent.templatesPath, path]));
        if (!existingPath) {
            throw new Error(`Cannot find template in ${possiblePaths.join(', ')}`);
        }
        return existingPath;
    }
    /** Compute the content path from the dynamic path */
    static computeContentPath(template) {
        // Get string service
        const stringService = typedi_1.Container.get(String_1.StringService);
        const types = stringService.types();
        let path = template.path;
        for (const type of types) {
            path = path.replace(new RegExp(`{${type}}`, 'g'), `__${type}__`);
        }
        return `${path}.${Template.computeExtension(template)}`;
    }
    /** @deprecated */
    static computeContentPathV1(template) {
        // Get string service
        const stringService = typedi_1.Container.get(String_1.StringService);
        const variants = stringService.variants('model');
        const keys = Object.keys(variants);
        let path = template.path;
        for (const key of keys) {
            path = path.replace(new RegExp(`{${key}}`, 'g'), variants[key]);
        }
        return `${path}.${Template.computeExtension(template)}`;
    }
    /** Compute the extension of the template */
    static computeExtension(template) {
        if (template.engine === 'hpf') {
            return 'hpf';
        }
        return 'js';
    }
}
exports.Template = Template;
//# sourceMappingURL=Template.js.map