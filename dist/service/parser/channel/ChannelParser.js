"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelParser = void 0;
const ChannelV1Parser_1 = require("./ChannelV1Parser");
const ChannelV2Parser_1 = require("./ChannelV2Parser");
const Parser_1 = require("../Parser");
class ChannelParser extends Parser_1.Parser {
    getScope() {
        return 'channel';
    }
    getWorkersMap() {
        return {
            '1': ChannelV1Parser_1.ChannelV1Parser,
            '2': ChannelV2Parser_1.ChannelV2Parser,
        };
    }
}
exports.ChannelParser = ChannelParser;
//# sourceMappingURL=ChannelParser.js.map