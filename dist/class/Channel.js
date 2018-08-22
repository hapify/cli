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
const _1 = require("./");
class Channel {
    /**
     * Constructor
     * @param {string} path
     */
    constructor(path) {
        this.path = path;
        /** @type {string} */
        this.configFile = 'hapify.json';
        this.validate();
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // Copy config to instance
            const path = `${this.path}/${this.configFile}`;
            this.config = JSON.parse(Fs.readFileSync(path, 'utf8'));
            // Load each content file
            this.templates = [];
            for (let i = 0; i < this.config.templates.length; i++) {
                const template = (new _1.Template(this)).fromObject(this.config.templates[i]);
                yield template.load();
                this.templates.push(template);
            }
            // Load models
            this.modelsCollection = new _1.ModelsCollection(this, this.config.modelsPath);
            yield this.modelsCollection.load();
            // Load validator
            this.validator = new _1.Validator(this, this.config.validatorPath);
            yield this.validator.load();
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Copy all contents to files and update config
            for (const template of this.templates) {
                yield template.save();
            }
            this.config.templates = this.templates.map((m) => m.toObject());
            // Write models
            yield this.modelsCollection.save();
            this.config.modelsPath = this.modelsCollection.path;
            // Write validator
            yield this.validator.save();
            this.config.validatorPath = this.validator.path;
            // Write file
            const path = `${this.path}/${this.configFile}`;
            const data = JSON.stringify(this.config, null, 2);
            Fs.writeFileSync(path, data, 'utf8');
        });
    }
    /**
     * Denotes if the template should be considered as empty
     * @returns {boolean}
     */
    isEmpty() {
        const validatorIsEmpty = this.validator.isEmpty();
        const templatesAreEmpty = this.templates.every((template) => template.isEmpty());
        return validatorIsEmpty && templatesAreEmpty;
    }
    /**
     * Remove empty templates
     * @returns {void}
     */
    filter() {
        this.templates = this.templates.filter((template) => {
            return !template.isEmpty();
        });
    }
    /**
     * Denotes if the config file exists and its templates
     * If something is not valid, it throws an error.
     * @throws {Error}
     */
    validate() {
        const path = `${this.path}/${this.configFile}`;
        if (!Fs.existsSync(path)) {
            throw new Error(`Channel config's path ${path} does not exists.`);
        }
        let config;
        try {
            config = JSON.parse(Fs.readFileSync(path, 'utf8'));
        }
        catch (error) {
            throw new Error(`An error occurred while reading Channel config's at ${path}: ${error.toString()}`);
        }
        for (const template of config.templates) {
            const contentPath = `${this.path}/${template.contentPath}`;
            if (!Fs.existsSync(contentPath)) {
                throw new Error(`Channel template's path ${contentPath} does not exists.`);
            }
        }
        const validatorPath = `${this.path}/${config.validatorPath}`;
        if (!Fs.existsSync(validatorPath)) {
            throw new Error(`Channel validator's path ${validatorPath} does not exists.`);
        }
        const modelsPath = `${this.path}/${config.modelsPath}`;
        if (!Fs.existsSync(modelsPath)) {
            throw new Error(`Channel models' path ${modelsPath} does not exists.`);
        }
    }
}
exports.Channel = Channel;
//# sourceMappingURL=Channel.js.map