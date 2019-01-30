"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
class SingleSaveStorage {
    /** Constructor */
    constructor() { }
    /**
     * Should be called after loading to hash the content
     * @param {string} data
     */
    didLoad(data) {
        this.contentMd5 = md5_1.default(data);
    }
    /**
     * Denotes if the data has changed and update the hash if necessary
     * This method should not be called twice at the same time as it updates the hash.
     * @param {string} data
     * @return {boolean}
     */
    shouldSave(data) {
        const contentMd5 = md5_1.default(data);
        if (contentMd5 !== this.contentMd5) {
            this.contentMd5 = contentMd5;
            return true;
        }
        return false;
    }
}
exports.SingleSaveStorage = SingleSaveStorage;
//# sourceMappingURL=SingleSaveStorage.js.map