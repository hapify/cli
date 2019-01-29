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
const interface_1 = require("../interface");
const _1 = require("./");
const enum_1 = require("../enum");
const md5_1 = __importDefault(require("md5"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const Joi = __importStar(require("joi"));
const FieldType_1 = require("./FieldType");
class Channel extends _1.SingleSave {
    /**
     * Constructor
     * @param {string} path
     * @param {string|null} name
     */
    constructor(path, name = null) {
        super();
        this.path = path;
        /** @type {string} */
        this.description = null;
        /** @type {string} */
        this.logo = null;
        this.name = name ? name : Path.basename(path);
        this.id = md5_1.default(this.path);
        this.templatesPath = Path.join(this.path, Channel.defaultFolder);
        this.validate();
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // Copy config to instance
            const path = Path.join(this.path, Channel.configFile);
            const data = Fs.readFileSync(path, 'utf8');
            this.config = JSON.parse(data);
            this.didLoad(data);
            // Complete channel info
            if (this.config.name) {
                this.name = this.config.name;
            }
            if (this.config.description) {
                this.description = this.config.description;
            }
            if (this.config.logo) {
                this.logo = this.config.logo;
            }
            if (this.config.defaultFields) {
                this.defaultFields = this.config.defaultFields;
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
            // Copy all contents to files and update config
            for (const template of this.templates) {
                yield template.save();
            }
            this.config.templates = this.templates.map((m) => {
                const t = m.toObject();
                delete t.content;
                return t;
            });
            // Write validator
            yield this.validator.save();
            this.config.validatorPath = this.validator.path;
            // Write file if necessary
            const data = JSON.stringify(this.config, null, 2);
            if (this.shouldSave(data)) {
                const path = `${this.path}/${Channel.configFile}`;
                Fs.writeFileSync(path, data, 'utf8');
            }
            // Cleanup files in template path
            const legitFiles = [Path.join(this.path, this.config.validatorPath)];
            for (const template of this.templates) {
                legitFiles.push(Path.join(this.templatesPath, template.contentPath));
            }
            const allFiles = Channel.listAllFiles(Path.join(this.path, Channel.defaultFolder));
            for (const filePath of allFiles) {
                if (legitFiles.indexOf(filePath) < 0) {
                    Fs.unlinkSync(filePath);
                }
            }
            Channel.clearEmptyDirectories(Path.join(this.path, Channel.defaultFolder));
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
        // Validate the incoming config
        const validation = Joi.validate(config, interface_1.ConfigSchema);
        if (validation.error) {
            // Transform Joi message
            interface_1.TransformValidationMessage(validation.error);
            throw validation.error;
        }
        for (const template of config.templates) {
            const contentPath = Path.join(this.templatesPath, _1.Template.computeContentPath(template));
            if (!Fs.existsSync(contentPath)) {
                throw new Error(`Channel template's path ${contentPath} does not exists.`);
            }
        }
        const validatorPath = Path.join(this.path, config.validatorPath);
        if (!Fs.existsSync(validatorPath)) {
            throw new Error(`Channel validator's path ${validatorPath} does not exists.`);
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
                name: 'New channel',
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
            // Create dir
            mkdirp_1.default.sync(Path.join(path, Channel.defaultFolder, 'models', 'model'));
            // Dump config file
            const configData = JSON.stringify(config, null, 2);
            Fs.writeFileSync(configPath, configData, 'utf8');
            // Create template file
            const templateContent = `// Hello <<M A>>`;
            const templatePath = Path.join(path, Channel.defaultFolder, 'models', 'model', 'hello.js.hpf');
            Fs.writeFileSync(templatePath, templateContent, 'utf8');
            // Create validator file
            const validatorContent = `// Models validation script\nreturn { errors: [], warnings: [] };`;
            const validatorPath = Path.join(path, Channel.defaultFolder, 'validator.js');
            Fs.writeFileSync(validatorPath, validatorContent, 'utf8');
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
            // Otherwise create a new temaplte
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
            description: this.description,
            logo: this.logo,
            templates: this.templates.map((template) => template.toObject()),
            validator: this.validator.content
        };
    }
    /**
     * Get all files' absolute path from a directory
     * @param {string} rootPath
     * @return {string[]}
     */
    static listAllFiles(rootPath) {
        // Read the whole directory
        const entries = Fs.readdirSync(rootPath).map(dir => Path.join(rootPath, dir));
        // Get sub-files
        const subFiles = entries
            .filter(subPath => Fs.statSync(subPath).isDirectory())
            .map(subPath => Channel.listAllFiles(subPath))
            .reduce((flatten, files) => flatten.concat(files), []);
        // Return files and sub-files
        return entries
            .filter(subPath => Fs.statSync(subPath).isFile())
            .concat(subFiles);
    }
    /**
     * Delete all directories if empty
     * @param {string} rootPath
     */
    static clearEmptyDirectories(rootPath) {
        // Remove sub-directories
        Fs.readdirSync(rootPath)
            .map(dir => Path.join(rootPath, dir))
            .filter(subPath => Fs.statSync(subPath).isDirectory())
            .forEach(subPath => Channel.clearEmptyDirectories(subPath));
        // Count remaining files & dirs
        const count = Fs.readdirSync(rootPath).length;
        if (count === 0) {
            Fs.rmdirSync(rootPath);
        }
    }
}
/** @type {string} */
Channel.defaultFolder = 'hapify';
/** @type {string} */
Channel.configFile = 'hapify.json';
exports.Channel = Channel;
//# sourceMappingURL=Channel.js.map