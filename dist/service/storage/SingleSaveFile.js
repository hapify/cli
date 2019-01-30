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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const SingleSave_1 = require("./SingleSave");
const Fs = __importStar(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const Path = __importStar(require("path"));
let SingleSaveFileStorage = class SingleSaveFileStorage extends SingleSave_1.SingleSave {
    /** Load content from path */
    get(contentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = Fs.readFileSync(contentPath, 'utf8');
            this.didLoad(contentPath, content);
            return content;
        });
    }
    /** Load content from path */
    set(contentPath, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.shouldSave(contentPath, content)) {
                mkdirp_1.default.sync(Path.dirname(contentPath));
                Fs.writeFileSync(contentPath, content, 'utf8');
            }
        });
    }
};
SingleSaveFileStorage = __decorate([
    typedi_1.Service()
], SingleSaveFileStorage);
exports.SingleSaveFileStorage = SingleSaveFileStorage;
//# sourceMappingURL=SingleSaveFile.js.map