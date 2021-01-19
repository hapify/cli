"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const typedi_1 = require("typedi");
const Version_1 = require("../Version");
class Parser {
    constructor(input) {
        this.input = input;
        typedi_1.Container.get(Version_1.VersionService).ensureVersionIsSupported(this.getScope(), input.version);
        this.initWorker();
    }
    initWorker() {
        const workersMap = this.getWorkersMap();
        if (typeof workersMap[this.input.version] === 'undefined') {
            throw new Error(`Cannot find parser for ${this.getScope()} version ${this.input.version}`);
        }
        this.worker = new workersMap[this.input.version]();
    }
    convert() {
        return this.worker.convert(this.input);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map