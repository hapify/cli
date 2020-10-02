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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.SingleSaveFileStorage = exports.JoinPath = void 0;
const md5_1 = __importDefault(require("md5"));
const typedi_1 = require("typedi");
const Fs = __importStar(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const Path = __importStar(require("path"));
function JoinPath(path) {
    return path instanceof Array ? Path.join(...path) : path;
}
exports.JoinPath = JoinPath;
let SingleSaveFileStorage = class SingleSaveFileStorage {
    constructor() {
        /** The template's content's md5 hash */
        this.contentMd5 = {};
    }
    /** Load content from path */
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentPath = JoinPath(path);
            const content = Fs.readFileSync(contentPath, 'utf8');
            this.didLoad(contentPath, content);
            return yield this.deserialize(content);
        });
    }
    /** Load content from path */
    set(path, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.serialize(input);
            const contentPath = JoinPath(path);
            if (this.shouldSave(contentPath, content)) {
                mkdirp_1.default.sync(Path.dirname(contentPath));
                Fs.writeFileSync(contentPath, content, 'utf8');
            }
        });
    }
    /** Check if the resource exists */
    exists(path) {
        return Fs.existsSync(JoinPath(path));
    }
    /** Should be called after loading to hash the content */
    didLoad(bucket, data) {
        this.contentMd5[bucket] = md5_1.default(data);
    }
    /**
     * Denotes if the data has changed and update the hash if necessary
     * This method should not be called twice at the same time as it updates the hash.
     */
    shouldSave(bucket, data) {
        const contentMd5 = md5_1.default(data);
        if (typeof this.contentMd5[bucket] === 'undefined' || contentMd5 !== this.contentMd5[bucket]) {
            this.contentMd5[bucket] = contentMd5;
            return true;
        }
        return false;
    }
};
SingleSaveFileStorage = __decorate([
    typedi_1.Service()
], SingleSaveFileStorage);
exports.SingleSaveFileStorage = SingleSaveFileStorage;
//# sourceMappingURL=SingleSave.js.map