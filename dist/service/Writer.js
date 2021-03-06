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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriterService = void 0;
const typedi_1 = require("typedi");
const Fs = __importStar(require("fs-extra"));
const Path = __importStar(require("path"));
const jszip_1 = __importDefault(require("jszip"));
let WriterService = class WriterService {
    constructor() { }
    /** Zip results and write to disk */
    zip(path, results) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create ZIP
            const zip = new jszip_1.default();
            // Append files
            for (const result of results) {
                zip.file(result.path, result.content);
            }
            // Generate ZIP
            const content = yield zip.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9,
                },
            });
            Fs.ensureDirSync(Path.dirname(path));
            Fs.writeFileSync(path, content);
        });
    }
    /** Write results to disk */
    writeMany(root, results) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const result of results) {
                yield this.write(root, result);
            }
        });
    }
    /** Write on result to disk */
    write(root, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = Path.join(root, result.path);
            Fs.ensureDirSync(Path.dirname(path));
            Fs.writeFileSync(path, result.content, 'utf8');
        });
    }
};
WriterService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], WriterService);
exports.WriterService = WriterService;
//# sourceMappingURL=Writer.js.map