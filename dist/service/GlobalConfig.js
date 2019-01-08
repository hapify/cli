"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const Fs = __importStar(require("fs"));
const Os = __importStar(require("os"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const Joi = __importStar(require("joi"));
let GlobalConfigService = class GlobalConfigService {
    /** Constructor */
    constructor() {
        /** Define the config root path */
        this.rootPath = Path.resolve(Os.homedir(), '.hapify');
        /** The config file name */
        this.filename = 'config.json';
        /** The config file path */
        this.filePath = Path.join(this.rootPath, this.filename);
        /** Store the config data */
        this.data = {};
        /** Store the config data */
        this.dataValidator = Joi.object({
            apiKey: Joi.string().min(1).required()
        });
        this.init();
    }
    /** Create file if not exists */
    init() {
        // Create path
        if (!Fs.existsSync(this.rootPath) || !Fs.statSync(this.rootPath).isDirectory()) {
            mkdirp_1.default.sync(this.rootPath);
        }
        // Create file
        if (!Fs.existsSync(this.filePath) || !Fs.statSync(this.filePath).isFile()) {
            this.data.apiKey = '';
            this.save();
        }
        // Load config
        this.load();
    }
    /** Save data to config file */
    save() {
        Fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4), 'utf8');
    }
    /** Load data from config file */
    load() {
        this.data = JSON.parse(Fs.readFileSync(this.filePath, 'utf8'));
    }
    /** Validate the current config or scream */
    validate() {
        const validation = Joi.validate(this.data, this.dataValidator);
        if (validation.error) {
            const errorMessage = validation.error.details.map((v) => v.message).join(', ');
            throw new Error(`Please configure Hapify CLI before using it with command "hpf config" (Global config format error: ${errorMessage}).`);
        }
    }
    /** Returns the configs */
    getData() {
        return this.data;
    }
    /** Validate and save the configs */
    setData(data) {
        const validation = Joi.validate(data, this.dataValidator);
        if (validation.error) {
            const errorMessage = validation.error.details.map((v) => v.message).join(', ');
            throw new Error(`Global config format error: ${errorMessage}.`);
        }
        this.data = data;
        this.save();
    }
};
GlobalConfigService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], GlobalConfigService);
exports.GlobalConfigService = GlobalConfigService;
//# sourceMappingURL=GlobalConfig.js.map