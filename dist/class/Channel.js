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
const Path = __importStar(require("path"));
const interface_1 = require("../interface");
const _1 = require("./");
const enum_1 = require("../enum");
const md5_1 = __importDefault(require("md5"));
const Joi = __importStar(require("joi"));
const FieldType_1 = require("./FieldType");
const typedi_1 = require("typedi");
const service_1 = require("../service");
class Channel {
    /**
     * Constructor
     * @param {string} path
     * @param {string|null} name
     */
    constructor(path, name = null) {
        this.path = path;
        this.storageService = typedi_1.Container.get(service_1.ChannelFileStorageService);
        this.name = name ? name : Path.basename(path);
        this.id = md5_1.default(this.path);
        this.templatesPath = Path.join(this.path, Channel.defaultFolder);
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate storage
            yield this.validate();
            // Get config from storage
            const config = yield this.storageService.get([
                this.path,
                Channel.configFile
            ]);
            // Validate the incoming config
            const validation = Joi.validate(config, interface_1.ConfigSchema);
            if (validation.error) {
                // Transform Joi message
                interface_1.TransformValidationMessage(validation.error);
                throw validation.error;
            }
            // Apply configuration
            this.config = config;
            // Override default name if given
            if (this.config.name) {
                this.name = this.config.name;
            }
            // Load each content file
            this.templates = [];
            for (let i = 0; i < this.config.templates.length; i++) {
                const template = new _1.Template(this, Object.assign(this.config.templates[i], { content: '' }));
                yield template.load();
                this.templates.push(template);
            }
            // Load models
            this.modelsCollection = yield _1.ModelsCollection.getInstance(this.config.project);
            // Load validator
            this.validator = new _1.Validator(this, this.config.validatorPath);
            yield this.validator.load();
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Saves subs instances
            for (const template of this.templates) {
                yield template.save();
            }
            yield this.validator.save();
            // Update configurations
            this.config.templates = this.templates.map(m => {
                const t = m.toObject();
                delete t.content;
                return t;
            });
            this.config.validatorPath = this.validator.path;
            // Write file if necessary
            yield this.storageService.set([this.path, Channel.configFile], this.config);
            // Cleanup files in template path
            const legitFiles = this.templates.map(t => [
                this.templatesPath,
                t.contentPath
            ]);
            legitFiles.push([this.path, this.config.validatorPath]);
            yield this.storageService.cleanup([this.path, Channel.defaultFolder], legitFiles);
        });
    }
    /**
     * Denotes if the template should be considered as empty
     * @returns {boolean}
     */
    isEmpty() {
        const validatorIsEmpty = this.validator.isEmpty();
        const templatesAreEmpty = this.templates.every(t => t.isEmpty());
        return validatorIsEmpty && templatesAreEmpty;
    }
    /**
     * Remove empty templates
     * @returns {void}
     */
    filter() {
        this.templates = this.templates.filter(t => !t.isEmpty());
    }
    /**
     * Check resource validity
     * @throws {Error}
     */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.storageService.exists([this.path, Channel.configFile]))) {
                throw new Error(`Channel config's path ${this.path}/${Channel.configFile} does not exists.`);
            }
        });
    }
    /** Denotes if the config file exists */
    static configExists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typedi_1.Container.get(service_1.ChannelFileStorageService).exists([
                path,
                Channel.configFile
            ]);
        });
    }
    /** Init a Hapify structure within a directory */
    static create(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield Channel.configExists(path)) {
                throw new Error(`A channel already exists in this directory.`);
            }
            // Create a channel from scratch
            const channel = new Channel(path);
            channel.config = {
                validatorPath: `${Channel.defaultFolder}/validator.js`,
                name: channel.name,
                description: 'A brand new channel',
                project: 'projectId',
                defaultFields: [
                    {
                        name: 'Id',
                        type: FieldType_1.FieldType.String,
                        subtype: null,
                        reference: null,
                        primary: true,
                        unique: false,
                        label: false,
                        nullable: false,
                        multiple: false,
                        important: false,
                        searchable: false,
                        sortable: false,
                        isPrivate: false,
                        internal: true,
                        restricted: false,
                        ownership: true
                    }
                ],
                templates: [
                    {
                        path: 'models/{model.hyphen}/hello.js',
                        engine: enum_1.TemplateEngine.Hpf,
                        input: enum_1.TemplateInput.One
                    }
                ]
            };
            // Create template
            const template = new _1.Template(channel, Object.assign(channel.config.templates[0], {
                content: '// Hello <<M A>>'
            }));
            channel.templates.push(template);
            // Create validator
            channel.validator = new _1.Validator(channel, channel.config.validatorPath);
            channel.validator.content = `// Models validation script\nreturn { errors: [], warnings: [] };`;
            // Save channel
            yield channel.save();
        });
    }
    /** @inheritDoc */
    fromObject(object) {
        // Do not update name nor id
        // Create or update templates if necessary
        // By keeping the same instances, we will avoid a file saving if the content did not change
        this.templates = object.templates.map(t => {
            // Try to find an existing template
            const existing = this.templates.find(e => e.path === t.path);
            if (existing) {
                return existing.fromObject(t);
            }
            // Otherwise create a new template
            return new _1.Template(this, t);
        });
        // Update validator
        this.validator.content = object.validator;
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            description: this.config.description || null,
            logo: this.config.logo || null,
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