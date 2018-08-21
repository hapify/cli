"use strict";
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
const Fs = __importStar(require("fs"));
class Bootstrap {
    /**
     * Constructor
     * @param {string} path
     */
    constructor(path) {
        this.path = path;
        /** @type {string} */
        this.configFile = 'hapify.json';
        this.validate();
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // Copy config to instance
            const path = `${this.path}/${this.configFile}`;
            this.config = JSON.parse(Fs.readFileSync(path, 'utf8'));
            // Load each content file
            for (let i = 0; i < this.config.masks.length; i++) {
                const contentPath = `${this.path}/${this.config.masks[i].contentPath}`;
                this.config.masks[i].content = Fs.readFileSync(contentPath, 'utf8');
            }
            // Load validator
            const validatorPath = `${this.path}/${this.config.validatorPath}`;
            this.config.validator = Fs.readFileSync(validatorPath, 'utf8');
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Copy all contents to files
            for (let i = 0; i < this.config.masks.length; i++) {
                const contentPath = `${this.path}/${this.config.masks[i].contentPath}`;
                Fs.writeFileSync(contentPath, this.config.masks[i].content, 'utf8');
            }
            // Write validator
            const validatorPath = `${this.path}/${this.config.validatorPath}`;
            Fs.writeFileSync(validatorPath, this.config.validator, 'utf8');
            // Clone o and filter object, then save it
            const clone = Object.assign({}, this.config);
            delete clone.validator;
            clone.masks = clone.masks.map((mask) => {
                delete mask.content;
                return mask;
            });
            // Write file
            const path = `${this.path}/${this.configFile}`;
            const data = JSON.stringify(clone, null, 2);
            Fs.writeFileSync(path, data, 'utf8');
        });
    }
    /**
     * Denotes if the config file exists and its templates
     * If something is not valid, it throws an error.
     * @throws {Error}
     */
    validate() {
        const path = `${this.path}/${this.configFile}`;
        if (!Fs.existsSync(path)) {
            throw new Error(`Bootstrap config's path ${path} does not exists.`);
        }
        let config;
        try {
            config = JSON.parse(Fs.readFileSync(path, 'utf8'));
        }
        catch (error) {
            throw new Error(`An error occurred while reading Bootstrap config's at ${path}: ${error.toString()}`);
        }
        for (const mask of config.masks) {
            const contentPath = `${this.path}/${mask.contentPath}`;
            if (!Fs.existsSync(contentPath)) {
                throw new Error(`Bootstrap mask's path ${contentPath} does not exists.`);
            }
        }
        const validatorPath = `${this.path}/${config.validatorPath}`;
        if (!Fs.existsSync(validatorPath)) {
            throw new Error(`Bootstrap validator's path ${validatorPath} does not exists.`);
        }
    }
}
exports.default = Bootstrap;
//# sourceMappingURL=Bootstrap.js.map