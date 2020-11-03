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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsService = void 0;
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const GlobalConfig_1 = require("./GlobalConfig");
const Remote_1 = require("../config/Remote");
let OptionsService = class OptionsService {
    constructor(globalConfigService) {
        this.globalConfigService = globalConfigService;
    }
    /** Set program entity */
    setProgram(program) {
        this.program = program;
    }
    /** Set command entity */
    setCommand(command) {
        this.command = command;
    }
    /** Returns the remote config and override defaults with global config (if any) */
    remoteConfig() {
        const configs = Object.assign({}, Remote_1.RemoteConfig);
        configs.uri = this.apiUrl();
        return configs;
    }
    /** Return the working directory computed with the --dir option */
    dir() {
        if (this.program.dir) {
            if (Path.isAbsolute(this.program.dir)) {
                return this.program.dir;
            }
            return Path.resolve(process.cwd(), this.program.dir);
        }
        return process.cwd();
    }
    /** Return the API Key to use (explicit or global) */
    apiKey() {
        const key = this.program.key || this.globalConfigService.getData().apiKey;
        if (!key) {
            throw new Error('Please define an API Key using command "hpf key" or the option "--key".\nTo get your api key, please visit https://www.hapify.io/my-key');
        }
        return key;
    }
    /** Return the API URL to use or default URL */
    apiUrl() {
        const url = this.globalConfigService.getData().apiUrl;
        return url || Remote_1.RemoteConfig.uri;
    }
    /** Denotes if the debug mode is enabled */
    debug() {
        return !!this.program.debug;
    }
    /** Denotes if the silent mode is enabled */
    silent() {
        return !!this.program.silent;
    }
    /** Get the depth for recursive search */
    depth() {
        return Number(this.command.depth);
    }
    /** Get the output file path */
    output() {
        return this.command.output;
    }
    /** Get the required http port */
    port() {
        return Number(this.command.port);
    }
    /** Get the required http hostname */
    hostname() {
        return this.command.hostname;
    }
    /** Denotes if a new tab should be opened */
    open() {
        return this.command.open !== false;
    }
};
OptionsService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [GlobalConfig_1.GlobalConfigService])
], OptionsService);
exports.OptionsService = OptionsService;
//# sourceMappingURL=Options.js.map