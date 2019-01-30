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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    /** Load content from path */
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentPath = JoinPath(path);
            const content = (Fs.readFileSync(Path.join(...contentPath), 'utf8'));
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
    /** Check if the resource exsists */
    exists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return Fs.existsSync(JoinPath(path));
        });
    }
    /**
     * Should be called after loading to hash the content
     * @param {string} bucket
     * @param {string} data
     */
    didLoad(bucket, data) {
        this.contentMd5[bucket] = md5_1.default(data);
    }
    /**
     * Denotes if the data has changed and update the hash if necessary
     * This method should not be called twice at the same time as it updates the hash.
     * @param {string} bucket
     * @param {string} data
     * @return {boolean}
     */
    shouldSave(bucket, data) {
        const contentMd5 = md5_1.default(data);
        if (typeof this.contentMd5[bucket] === 'undefined' ||
            contentMd5 !== this.contentMd5[bucket]) {
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