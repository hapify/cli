"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var ChannelStorageService_1;
const typedi_1 = require("typedi");
const SingleSave_1 = require("./SingleSave");
const Path = __importStar(require("path"));
const Fs = __importStar(require("fs"));
let ChannelStorageService = ChannelStorageService_1 = class ChannelStorageService extends SingleSave_1.SingleSaveFileStorage {
    /** @inheritDoc */
    serialize(content) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.stringify(content, null, 2);
        });
    }
    /** @inheritDoc */
    deserialize(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return JSON.parse(content);
            }
            catch (error) {
                throw new Error(`An error occurred while parsing Channel configuration: ${error.toString()}`);
            }
        });
    }
    /** Cleanup unused files */
    cleanup(root, legitFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const joinedRoot = SingleSave_1.JoinPath(root);
            const joinedLegitFiles = legitFiles.map(SingleSave_1.JoinPath);
            const allFiles = ChannelStorageService_1.listAllFiles(joinedRoot);
            for (const filePath of allFiles) {
                if (joinedLegitFiles.indexOf(filePath) < 0) {
                    Fs.unlinkSync(filePath);
                }
            }
            ChannelStorageService_1.clearEmptyDirectories(joinedRoot);
        });
    }
    /** Get all files' absolute path from a directory */
    static listAllFiles(rootPath) {
        // Read the whole directory
        const entries = Fs.readdirSync(rootPath).map(dir => Path.join(rootPath, dir));
        // Get sub-files
        const subFiles = entries
            .filter(subPath => Fs.statSync(subPath).isDirectory())
            .map(subPath => ChannelStorageService_1.listAllFiles(subPath))
            .reduce((flatten, files) => flatten.concat(files), []);
        // Return files and sub-files
        return entries
            .filter(subPath => Fs.statSync(subPath).isFile())
            .concat(subFiles);
    }
    /** Delete all directories if empty */
    static clearEmptyDirectories(rootPath) {
        // Remove sub-directories
        Fs.readdirSync(rootPath)
            .map(dir => Path.join(rootPath, dir))
            .filter(subPath => Fs.statSync(subPath).isDirectory())
            .forEach(subPath => ChannelStorageService_1.clearEmptyDirectories(subPath));
        // Count remaining files & dirs
        const count = Fs.readdirSync(rootPath).length;
        if (count === 0) {
            Fs.rmdirSync(rootPath);
        }
    }
};
ChannelStorageService = ChannelStorageService_1 = __decorate([
    typedi_1.Service()
], ChannelStorageService);
exports.ChannelStorageService = ChannelStorageService;
//# sourceMappingURL=Channel.js.map