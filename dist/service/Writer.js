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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const Fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const jszip_1 = __importDefault(require("jszip"));
let WriterService = class WriterService {
    /** Constructor */
    constructor() { }
    /**
     * Zip results and write to disk
     * @param {string} path
     * @param {IGeneratorResult[]} results
     * @return {Promise<void>}
     */
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
                    level: 9
                }
            });
            yield this.ensureDir(path);
            Fs.writeFileSync(path, content);
        });
    }
    /**
     * Write results to disk
     * @param {string} root
     * @param {IGeneratorResult[]} results
     * @return {Promise<void>}
     */
    writeMany(root, results) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const result of results) {
                yield this.write(root, result);
            }
        });
    }
    /**
     * Write on result to disk
     * @param {string} root
     * @param {IGeneratorResult} result
     * @return {Promise<void>}
     */
    write(root, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = Path.join(root, result.path);
            yield this.ensureDir(path);
            Fs.writeFileSync(path, result.content, 'utf8');
        });
    }
    /**
     * Create containing directory
     * @param {string} path
     * @return {Promise<void>}
     */
    ensureDir(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirPath = Path.dirname(path);
            if (Fs.existsSync(dirPath)) {
                return;
            }
            yield this.ensureDir(dirPath);
            Fs.mkdirSync(dirPath);
        });
    }
};
WriterService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], WriterService);
exports.WriterService = WriterService;
//# sourceMappingURL=Writer.js.map