"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
class SingleSave {
    /** Constructor */
    constructor() { }
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
}
exports.SingleSave = SingleSave;
//# sourceMappingURL=SingleSave.js.map