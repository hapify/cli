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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const _1 = require("./");
const enum_1 = require("../enum");
const md5_1 = __importDefault(require("md5"));
class Channel {
    /**
     * Constructor
     * @param {string} path
     * @param {string|null} name
     */
    constructor(path, name = null) {
        this.path = path;
        this.validate();
        this.name = name ? name : Path.basename(path);
        this.id = md5_1.default(this.name);
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // Copy config to instance
            const path = Path.join(this.path, Channel.configFile);
            this.config = JSON.parse(Fs.readFileSync(path, 'utf8'));
            // Load each content file
            this.templates = [];
            for (let i = 0; i < this.config.templates.length; i++) {
                const template = (new _1.Template(this)).fromObject(Object.assign(this.config.templates[i], { content: '' }));
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
            this.config.templates = this.templates.map((m) => {
                const t = m.toObject();
                delete t.content;
                return t;
            });
            // Write models
            yield this.modelsCollection.save();
            this.config.modelsPath = this.modelsCollection.path;
            // Write validator
            yield this.validator.save();
            this.config.validatorPath = this.validator.path;
            // Write file
            const path = `${this.path}/${Channel.configFile}`;
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
        const path = Path.join(this.path, Channel.configFile);
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
            const contentPath = Path.join(this.path, template.contentPath);
            if (!Fs.existsSync(contentPath)) {
                throw new Error(`Channel template's path ${contentPath} does not exists.`);
            }
        }
        const validatorPath = Path.join(this.path, config.validatorPath);
        if (!Fs.existsSync(validatorPath)) {
            throw new Error(`Channel validator's path ${validatorPath} does not exists.`);
        }
        const modelsPath = Path.join(this.path, config.modelsPath);
        if (!Fs.existsSync(modelsPath)) {
            throw new Error(`Channel models' path ${modelsPath} does not exists.`);
        }
    }
    /**
     * Denotes if the config file exists
     * @param {string} path
     * @return {boolean}
     */
    static configExists(path) {
        const configPath = Path.join(path, Channel.configFile);
        return Fs.existsSync(configPath);
    }
    /**
     * Init a Hapify structure within a directory
     * @param {string} path
     * @return {Promise<void>}
     */
    static create(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Fs.existsSync(path)) {
                throw new Error(`Channel's path ${path} does not exists.`);
            }
            const configPath = Path.join(path, Channel.configFile);
            if (Fs.existsSync(configPath)) {
                throw new Error(`A channel already exists in this directory.`);
            }
            const config = {
                validatorPath: `${Channel.defaultFolder}/validator.js`,
                modelsPath: '../models.json',
                templates: [
                    {
                        name: 'Hello World',
                        path: 'models/{model.hyphen}/hello.js',
                        engine: enum_1.TemplateEngine.Hpf,
                        input: enum_1.TemplateInput.One,
                        contentPath: `${Channel.defaultFolder}/model/hello.js.hpf`
                    }
                ]
            };
            // Create dir
            Fs.mkdirSync(Path.join(path, Channel.defaultFolder));
            Fs.mkdirSync(Path.join(path, Channel.defaultFolder, 'model'));
            // Dump config file
            const configData = JSON.stringify(config, null, 2);
            Fs.writeFileSync(configPath, configData, 'utf8');
            // Create template file
            const templateContent = `// Hello <<M A>>`;
            const templatePath = Path.join(path, Channel.defaultFolder, 'model', 'hello.js.hpf');
            Fs.writeFileSync(templatePath, templateContent, 'utf8');
            // Create validator file
            const validatorContent = `// Models validation script`;
            const validatorPath = Path.join(path, Channel.defaultFolder, 'validator.js');
            Fs.writeFileSync(validatorPath, validatorContent, 'utf8');
        });
    }
    /** @inheritDoc */
    fromObject(object) {
        // this.id = object.id;
        // this.name = object.name;
        // this.templates = object.fields.map((fieldBase: IField): Field => {
        //   const field = new Field();
        //   return field.fromObject(fieldBase);
        // });
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            templates: this.templates.map((template) => template.toObject()),
            validator: this.validator.content
        };
    }
}
/** @type {string} */
Channel.defaultFolder = 'hapify';
/** @type {string} */
Channel.configFile = 'hapify.json';
exports.Channel = Channel;
//# sourceMappingURL=Channel.js.map