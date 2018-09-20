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
const Path = __importStar(require("path"));
const _1 = require("./");
class ModelsCollection extends _1.SingleSave {
    /**
     * Constructor
     * @param {Channel} parent
     * @param {string} path
     */
    constructor(parent, path) {
        super();
        this.parent = parent;
        this.path = path;
        this.modelsPath = Path.join(this.parent.path, this.path);
    }
    /** @inheritDoc */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Fs.readFileSync(this.modelsPath, 'utf8');
            const models = JSON.parse(data);
            this.didLoad(data);
            this.fromObject(models);
        });
    }
    /** @inheritDoc */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(this.toObject(), null, 2);
            if (this.shouldSave(data)) {
                Fs.writeFileSync(this.modelsPath, data, 'utf8');
            }
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
    /** @inheritDoc */
    fromObject(object) {
        this.models = object.map((model) => {
            const m = new _1.Model();
            return m.fromObject(model);
        });
        return this.models;
    }
    /** @inheritDoc */
    toObject() {
        return this.models.map((model) => model.toObject());
    }
}
exports.ModelsCollection = ModelsCollection;
//# sourceMappingURL=ModelsCollection.js.map