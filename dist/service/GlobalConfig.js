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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConfigService = void 0;
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const Fs = __importStar(require("fs"));
const Os = __importStar(require("os"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const Config_1 = require("../interface/schema/Config");
let GlobalConfigService = class GlobalConfigService {
    constructor() {
        /** Define the config root path */
        this.rootPath = Path.resolve(Os.homedir(), '.hapify');
        /** The config file name */
        this.filename = 'config.json';
        /** The config file path */
        this.filePath = Path.join(this.rootPath, this.filename);
        /** Store the config data */
        this.data = {};
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
            this.save();
        }
        // Load & validate config
        this.load();
        this.validate();
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
    validate(data = this.data) {
        const validation = Config_1.GlobalConfigSchema.validate(data);
        if (validation.error) {
            const errorMessage = validation.error.details
                .map((v) => {
                if (v.context.key === 'apiKey') {
                    return `${v.message}. Please visit https://www.hapify.io/my-key`;
                }
                return v.message;
            })
                .join(', ');
            throw new Error(`Global config format error: ${errorMessage}.`);
        }
    }
    /** Returns the configs */
    getData() {
        return this.data;
    }
    /** Validate and save the configs */
    setData(data) {
        this.validate(data);
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