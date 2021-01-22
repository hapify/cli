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
var ChannelFileStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelFileStorageService = void 0;
const typedi_1 = require("typedi");
const SingleSave_1 = require("./SingleSave");
const Path = __importStar(require("path"));
const Fs = __importStar(require("fs-extra"));
const ChannelParser_1 = require("../../parser/channel/ChannelParser");
const Converter_1 = require("../../Converter");
let ChannelFileStorageService = ChannelFileStorageService_1 = class ChannelFileStorageService extends SingleSave_1.SingleSaveFileStorage {
    constructor(converterService) {
        super();
        this.converterService = converterService;
    }
    serialize(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const compact = {
                version: content.version,
                validatorPath: content.validatorPath,
                project: content.project,
                name: content.name || undefined,
                description: content.description || undefined,
                logo: content.logo || undefined,
                defaultFields: content.defaultFields ? content.defaultFields.map((f) => this.converterService.convertFieldToCompactFormat(f)) : undefined,
                templates: content.templates,
            };
            return JSON.stringify(compact, null, 2);
        });
    }
    deserialize(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedContent = JSON.parse(content);
                const compact = new ChannelParser_1.ChannelParser(parsedContent).convert();
                return {
                    version: compact.version,
                    validatorPath: compact.validatorPath,
                    project: compact.project,
                    name: compact.name,
                    description: compact.description,
                    logo: compact.logo,
                    defaultFields: compact.defaultFields ? compact.defaultFields.map((f) => this.converterService.convertFieldFromCompactFormat(f)) : undefined,
                    templates: compact.templates,
                };
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
            const allFiles = ChannelFileStorageService_1.listAllFiles(joinedRoot);
            for (const filePath of allFiles) {
                if (joinedLegitFiles.indexOf(filePath) < 0) {
                    Fs.unlinkSync(filePath);
                }
            }
            ChannelFileStorageService_1.clearEmptyDirectories(joinedRoot);
        });
    }
    /** Get all files' absolute path from a directory */
    static listAllFiles(rootPath) {
        // Read the whole directory
        const entries = Fs.readdirSync(rootPath).map((dir) => Path.join(rootPath, dir));
        // Get sub-files
        const subFiles = entries
            .filter((subPath) => Fs.statSync(subPath).isDirectory())
            .map((subPath) => ChannelFileStorageService_1.listAllFiles(subPath))
            .reduce((flatten, files) => flatten.concat(files), []);
        // Return files and sub-files
        return entries.filter((subPath) => Fs.statSync(subPath).isFile()).concat(subFiles);
    }
    /** Delete all directories if empty */
    static clearEmptyDirectories(rootPath) {
        // Remove sub-directories
        Fs.readdirSync(rootPath)
            .map((dir) => Path.join(rootPath, dir))
            .filter((subPath) => Fs.statSync(subPath).isDirectory())
            .forEach((subPath) => ChannelFileStorageService_1.clearEmptyDirectories(subPath));
        // Count remaining files & dirs
        const count = Fs.readdirSync(rootPath).length;
        if (count === 0) {
            Fs.rmdirSync(rootPath);
        }
    }
};
ChannelFileStorageService = ChannelFileStorageService_1 = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Converter_1.ConverterService])
], ChannelFileStorageService);
exports.ChannelFileStorageService = ChannelFileStorageService;
//# sourceMappingURL=Channel.js.map