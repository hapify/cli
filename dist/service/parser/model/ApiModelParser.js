"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModelParser = void 0;
const ApiModelV1Parser_1 = require("./ApiModelV1Parser");
const ApiModelV2Parser_1 = require("./ApiModelV2Parser");
const Parser_1 = require("../Parser");
class ApiModelParser extends Parser_1.Parser {
    getScope() {
        return 'model';
    }
    getWorkersMap() {
        return {
            '1': ApiModelV1Parser_1.ApiModelV1Parser,
            '2': ApiModelV2Parser_1.ApiModelV2Parser,
        };
    }
}
exports.ApiModelParser = ApiModelParser;
//# sourceMappingURL=ApiModelParser.js.map