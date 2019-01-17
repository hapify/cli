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
var ChannelsService_1;
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const Options_1 = require("./Options");
const Fs = __importStar(require("fs"));
const class_1 = require("../class");
let ChannelsService = ChannelsService_1 = class ChannelsService {
    /**
     * Constructor
     * @param optionsService
     */
    constructor(optionsService) {
        this.optionsService = optionsService;
    }
    /**
     * Get the channels. Load them if not loaded yet
     * @return {Channel[]}
     * @throws {Error}
     */
    channels() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(this._channels instanceof Array)) {
                this._channels = ChannelsService_1.sniff(this.optionsService.dir(), this.optionsService.depth());
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
    /**
     * Ensure that all channels refers to the same project
     * @throws {Error}
     */
    ensureSameProject() {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield this.channels();
            const firstProject = channels[0].config.project;
            for (const channel of channels) {
                if (channel.config.project !== firstProject) {
                    throw new Error('Channels must refer to the same project');
                }
            }
        });
    }
    /**
     * Returns the first models collection
     * @return {ModelsCollection}
     * @throws {Error}
     */
    modelsCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield this.channels();
            return channels[0].modelsCollection;
        });
    }
    /**
     * This method detect all channels in the directory and its sub-directories, and create instances for them.
     * We can define the depth level of subdirectories.
     * @param {string} path
     * @param {number} depth  Default: 2
     * @param {number} from  Default: path
     * @return {Channel[]}
     */
    static sniff(path, depth = 2, from = path) {
        // Get channels in sub-directories first
        const channels = depth <= 0 ? [] :
            Fs.readdirSync(path)
                .map((dir) => Path.join(path, dir))
                .filter((subPath) => Fs.statSync(subPath).isDirectory())
                .map((subPath) => ChannelsService_1.sniff(subPath, depth - 1, from))
                .reduce((flatten, channels) => flatten.concat(channels), []);
        // Get channel of current directory if exists
        if (class_1.Channel.configExists(path)) {
            const name = Path.relative(Path.dirname(from), path);
            const channel = new class_1.Channel(path, name);
            channels.push(channel);
        }
        return channels;
    }
};
ChannelsService = ChannelsService_1 = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Options_1.OptionsService])
], ChannelsService);
exports.ChannelsService = ChannelsService;
//# sourceMappingURL=Channels.js.map