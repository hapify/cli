"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPresetParser = void 0;
const ApiPresetV1Parser_1 = require("./ApiPresetV1Parser");
const Parser_1 = require("../Parser");
const ApiPresetV2Parser_1 = require("./ApiPresetV2Parser");
class ApiPresetParser extends Parser_1.Parser {
    getScope() {
        return 'preset';
    }
    getWorkersMap() {
        return {
            '1': ApiPresetV1Parser_1.ApiPresetV1Parser,
            '2': ApiPresetV2Parser_1.ApiPresetV2Parser,
        };
    }
}
exports.ApiPresetParser = ApiPresetParser;
//# sourceMappingURL=ApiPresetParser.js.map