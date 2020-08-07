"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const Path = __importStar(require("path"));
const md5_1 = __importDefault(require("md5"));
const Joi = __importStar(require("joi"));
const typedi_1 = require("typedi");
const Template_1 = require("./Template");
const Validator_1 = require("./Validator");
const Project_1 = require("./Project");
const ModelsCollection_1 = require("./ModelsCollection");
const Channel_1 = require("../service/storage/file/Channel");
const Config_1 = require("../interface/schema/Config");
const ValidatorResult_1 = require("../interface/schema/ValidatorResult");
class Channel {
    constructor(path, name = null) {
        this.path = path;
        /** Templates instances */
        this.templates = [];
        this.storageService = typedi_1.Container.get(Channel_1.ChannelFileStorageService);
        this.name = name ? name : Path.basename(path);
        this.id = md5_1.default(this.path);
        this.templatesPath = Path.join(this.path, Channel.defaultFolder);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate storage
            yield this.validate();
            // Get config from storage
            const config = yield this.storageService.get([this.path, Channel.configFile]);
            // Validate the incoming config
            const validation = Joi.validate(config, Config_1.ConfigSchema);
            if (validation.error) {
                // Transform Joi message
                ValidatorResult_1.TransformValidationMessage(validation.error);
                throw validation.error;
            }
            // Apply configuration
            this.config = config;
            // Override default name if given
            if (this.config.name) {
                this.name = this.config.name;
            }
            // Load project
            this.project = yield Project_1.Project.getInstance(this.config.project);
            // Load each content file
            for (let i = 0; i < this.config.templates.length; i++) {
                const template = new Template_1.Template(this, Object.assign(this.config.templates[i], { content: '' }));
                yield template.load();
                this.templates.push(template);
            }
            // Load models
            this.modelsCollection = yield ModelsCollection_1.ModelsCollection.getInstance(this.project);
            // Load validator
            this.validator = new Validator_1.Validator(this, this.config.validatorPath);
            yield this.validator.load();
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Saves subs instances
            for (const template of this.templates) {
                yield template.save();
            }
            yield this.validator.save();
            // Update configurations
            this.config.templates = this.templates.map((m) => {
                const t = m.toObject();
                delete t.content;
                return t;
            });
            this.config.validatorPath = this.validator.path;
            // Write file if necessary
            yield this.storageService.set([this.path, Channel.configFile], this.config);
            // Cleanup files in template path
            const legitFiles = this.templates.map((t) => [this.templatesPath, t.contentPath]);
            legitFiles.push([this.path, this.config.validatorPath]);
            yield this.storageService.cleanup([this.path, Channel.defaultFolder], legitFiles);
        });
    }
    /** Denotes if the template should be considered as empty */
    isEmpty() {
        const validatorIsEmpty = this.validator.isEmpty();
        const templatesAreEmpty = this.templates.every((t) => t.isEmpty());
        return validatorIsEmpty && templatesAreEmpty;
    }
    /** Remove empty templates */
    filter() {
        this.templates = this.templates.filter((t) => !t.isEmpty());
    }
    /** Check resource validity */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.storageService.exists([this.path, Channel.configFile]))) {
                throw new Error(`Channel config's path ${this.path}/${Channel.configFile} does not exists.`);
            }
        });
    }
    /** Change project in config file */
    static changeProject(path, project) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Channel.configExists(path)) {
                throw new Error(`Cannot find config file in ${path}`);
            }
            const storage = typedi_1.Container.get(Channel_1.ChannelFileStorageService);
            // Get config from storage
            const config = yield storage.get([path, Channel.configFile]);
            // Set value and save config
            config.project = project;
            yield storage.set([path, Channel.configFile], config);
        });
    }
    /** Denotes if the config file exists */
    static configExists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typedi_1.Container.get(Channel_1.ChannelFileStorageService).exists([path, Channel.configFile]);
        });
    }
    /** Init a Hapify structure within a directory */
    static create(path, name, description, logo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield Channel.configExists(path)) {
                throw new Error(`A channel already exists in this directory.`);
            }
            // Create a channel from scratch
            const channel = new Channel(path);
            channel.config = {
                version: '1',
                validatorPath: `${Channel.defaultFolder}/validator.js`,
                name: name || channel.name,
                description: description || 'A new Hapify channel',
                logo: logo || undefined,
                project: 'projectId',
                defaultFields: [
                    {
                        name: 'Id',
                        type: 'string',
                        subtype: null,
                        reference: null,
                        primary: true,
                        unique: false,
                        label: false,
                        nullable: false,
                        multiple: false,
                        embedded: false,
                        searchable: false,
                        sortable: false,
                        hidden: false,
                        internal: true,
                        restricted: false,
                        ownership: false,
                    },
                ],
                templates: [
                    {
                        path: 'models/{kebab}/hello.js',
                        engine: 'hpf',
                        input: 'one',
                    },
                ],
            };
            // Create template
            const template = new Template_1.Template(channel, Object.assign(channel.config.templates[0], {
                content: '// Hello <<M A>>',
            }));
            channel.templates.push(template);
            // Create validator
            channel.validator = new Validator_1.Validator(channel, channel.config.validatorPath);
            channel.validator.content = `// Models validation script\nreturn { errors: [], warnings: [] };`;
            // Save channel
            return channel;
        });
    }
    fromObject(object) {
        // Do not update name nor id
        // Create or update templates if necessary
        // By keeping the same instances, we will avoid a file saving if the content did not change
        this.templates = object.templates.map((t) => {
            // Try to find an existing template
            const existing = this.templates.find((e) => e.path === t.path);
            if (existing) {
                return existing.fromObject(t);
            }
            // Otherwise create a new template
            return new Template_1.Template(this, t);
        });
        // Update validator
        this.validator.content = object.validator;
        return this;
    }
    toObject() {
        return {
            id: this.id,
            name: this.name,
            description: this.config.description || null,
            logo: this.config.logo || null,
            templates: this.templates.map((template) => template.toObject()),
            validator: this.validator.content,
        };
    }
}
exports.Channel = Channel;
Channel.defaultFolder = 'hapify';
Channel.configFile = 'hapify.json';
//# sourceMappingURL=Channel.js.map