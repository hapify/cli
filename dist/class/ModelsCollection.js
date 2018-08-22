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
const _1 = require("./");
class ModelsCollection {
    /**
     * Constructor
     * @param {Channel} parent
     * @param {string} path
     */
    constructor(parent, path) {
        this.parent = parent;
        this.path = path;
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const modelsPath = `${this.parent.path}/${this.path}`;
            const models = JSON.parse(Fs.readFileSync(modelsPath, 'utf8'));
            this.models = models.map((model) => {
                const m = new _1.Model();
                return m.fromObject(model);
            });
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const modelsPath = `${this.parent.path}/${this.path}`;
            const models = this.models.map((model) => model.toObject());
            const data = JSON.stringify(models, null, 2);
            Fs.writeFileSync(modelsPath, data, 'utf8');
        });
    }
    /**
     * Find a instance with its id
     * @param {string} id
     * @returns {Promise<Model|null>}
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.models.find((instance) => instance.id === id);
        });
    }
    /**
     * Returns the list of models
     * @returns {Promise<Model[]>}
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.models;
        });
    }
}
exports.ModelsCollection = ModelsCollection;
//# sourceMappingURL=ModelsCollection.js.map