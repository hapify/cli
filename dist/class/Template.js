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
const enum_1 = require("../enum");
const typedi_1 = require("typedi");
const service_1 = require("../service");
class Template {
    /** Constructor */
    constructor(parent, object) {
        this.parent = parent;
        this.templatesStorageService = typedi_1.Container.get(service_1.TemplatesStorageService);
        if (object) {
            this.fromObject(object);
        }
    }
    /** @inheritDoc */
    fromObject(object) {
        this.path = object.path;
        this.engine = object.engine;
        this.input = object.input;
        this.content = object.content;
        this.contentPath = Template.computeContentPath(this);
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            path: this.path,
            engine: this.engine,
            input: this.input,
            content: this.content
        };
    }
    /**
     * Denotes if the template should be considered as empty
     * @returns {boolean}
     */
    isEmpty() {
        return (typeof this.content !== 'string' ||
            this.content === null ||
            this.content.trim().length === 0);
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
        return Template.computeExtension(this);
    }
    /**
     * Get the parent channel
     * @returns {Channel}
     */
    channel() {
        return this.parent;
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.content = yield this.templatesStorageService.get(`${this.parent.templatesPath}/${this.contentPath}`);
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.templatesStorageService.set(`${this.parent.templatesPath}/${this.contentPath}`, this.content);
        });
    }
    /**
     * Compute the content path from the dynamic path
     * @param {Template|IConfigTemplate} template
     * @return {string}
     */
    static computeContentPath(template) {
        // Get string service
        const stringService = typedi_1.Container.get(service_1.StringService);
        // Apply replacements
        const path = template.path
            .replace(/{model\.hyphen}/g, stringService.format(Template.defaultFolder, enum_1.SentenceFormat.SlugHyphen))
            .replace(/{model\.hyphenUpper}/g, stringService.format(Template.defaultFolder, enum_1.SentenceFormat.SlugHyphenUpperCase))
            .replace(/{model\.underscore}/g, stringService.format(Template.defaultFolder, enum_1.SentenceFormat.SlugUnderscore))
            .replace(/{model\.underscoreUpper}/g, stringService.format(Template.defaultFolder, enum_1.SentenceFormat.SlugUnderscoreUpperCase))
            .replace(/{model\.oneWord}/g, stringService.format(Template.defaultFolder, enum_1.SentenceFormat.SlugOneWord))
            .replace(/{model\.upperCamel}/g, stringService.format(Template.defaultFolder, enum_1.SentenceFormat.UpperCamelCase))
            .replace(/{model\.lowerCamel}/g, stringService.format(Template.defaultFolder, enum_1.SentenceFormat.LowerCamelCase));
        return `${path}.${Template.computeExtension(template)}`;
    }
    /**
     * Compute the extension of the template
     * @param {Template|IConfigTemplate} template
     * @return {string}
     */
    static computeExtension(template) {
        if (template.engine === enum_1.TemplateEngine.Hpf) {
            return 'hpf';
        }
        return 'js';
    }
}
/** @type {string} */
Template.defaultFolder = 'model';
exports.Template = Template;
//# sourceMappingURL=Template.js.map