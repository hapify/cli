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
var ChannelsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsService = void 0;
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const Options_1 = require("./Options");
const Fs = __importStar(require("fs"));
const hoek_1 = __importDefault(require("@hapi/hoek"));
const Channel_1 = require("../class/Channel");
const Project_1 = require("../class/Project");
let ChannelsService = ChannelsService_1 = class ChannelsService {
    constructor(optionsService) {
        this.optionsService = optionsService;
    }
    /** Get the channels. Load them if not loaded yet */
    channels() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(this._channels instanceof Array)) {
                this._channels = yield ChannelsService_1.sniff(this.optionsService.dir(), this.optionsService.depth());
                if (this._channels.length === 0) {
                    throw new Error('No channel found');
                }
                for (const channel of this._channels) {
                    yield channel.load();
                }
            }
            return this._channels;
        });
    }
    /** Ensure that all channels refers to the same project */
    ensureSameProject() {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield this.channels();
            const firstProject = channels[0].guessProjectIdOrPath();
            for (const channel of channels) {
                if (channel.guessProjectIdOrPath() !== firstProject) {
                    throw new Error('Channels must refer to the same project');
                }
            }
        });
    }
    /** Ensure that all channels define the same default fields */
    ensureSameDefaultFields() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get defined fields
            const channels = yield this.channels();
            const fieldsGroup = channels.filter((c) => !!c.config.defaultFields).map((c) => c.config.defaultFields);
            if (fieldsGroup.length < 2) {
                return;
            }
            // Compare each fields group to the first one
            const ref = fieldsGroup[0];
            for (let i = 1; i < fieldsGroup.length; i++) {
                if (!hoek_1.default.deepEqual(ref, fieldsGroup[i])) {
                    throw new Error('Default fields must match for all channels if defined');
                }
            }
        });
    }
    /**
     * Change project in all found channels from a given or current dir
     * This change the project without loading the channels
     */
    changeRemoteProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield ChannelsService_1.sniff(this.optionsService.dir(), this.optionsService.depth());
            if (channels.length === 0) {
                throw new Error('No channel found');
            }
            for (const channel of channels) {
                yield Channel_1.Channel.changeProject(channel.path, project);
            }
        });
    }
    /**
     * Use the same local project for all found channels
     * This change the project without loading the channels
     */
    mergeLocalProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            // Try to find channels
            const channels = yield ChannelsService_1.sniff(this.optionsService.dir(), this.optionsService.depth());
            if (channels.length === 0) {
                throw new Error('No channel found');
            }
            // If the one channel's project is local, use this project as reference and bind all other channels to this project
            let mainChannel;
            let mainChannelProjectPath;
            for (const channel of channels) {
                const projectPath = yield this.resolveLocalProjectPath(channel);
                if (projectPath) {
                    mainChannel = channel;
                    mainChannelProjectPath = projectPath;
                    break;
                }
            }
            if (!mainChannel) {
                // The user should choose a remote project
                return false;
            }
            for (const channel of channels) {
                if (channel === mainChannel)
                    continue;
                // Remove project file
                const projectPath = yield this.resolveLocalProjectPath(channel);
                if (projectPath && Fs.existsSync(projectPath)) {
                    Fs.unlinkSync(projectPath);
                }
                // Get relative path
                const newPath = Path.relative(Path.resolve(channel.path), mainChannelProjectPath);
                yield Channel_1.Channel.changeProject(channel.path, newPath);
            }
            return true;
        });
    }
    /** Returns null if the project is not local */
    resolveLocalProjectPath(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield channel.readConfigFile();
            if (Project_1.Project.isRemoteId(config.project))
                return null;
            return Path.isAbsolute(config.project) ? config.project : Path.resolve(channel.path, config.project);
        });
    }
    /** Returns the first models collection */
    modelsCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield this.channels();
            return channels[0].modelsCollection;
        });
    }
    /**
     * This method detect all channels in the directory and its sub-directories, and create instances for them.
     * We can define the depth level of subdirectories.
     */
    static sniff(path, depth = 2, from = path) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get channels in sub-directories first
            const channels = depth <= 0
                ? []
                : (yield Promise.all(Fs.readdirSync(path)
                    .map((dir) => Path.join(path, dir))
                    .filter((subPath) => Fs.statSync(subPath).isDirectory())
                    .map((subPath) => ChannelsService_1.sniff(subPath, depth - 1, from)))).reduce((flatten, channels) => flatten.concat(channels), []);
            // Get channel of current directory if exists
            if (yield Channel_1.Channel.configExists(path)) {
                const name = Path.relative(Path.dirname(from), path);
                const channel = new Channel_1.Channel(path, name);
                channels.push(channel);
            }
            return channels;
        });
    }
};
ChannelsService = ChannelsService_1 = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Options_1.OptionsService])
], ChannelsService);
exports.ChannelsService = ChannelsService;
//# sourceMappingURL=Channels.js.map