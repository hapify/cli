"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectParser = void 0;
const ProjectV1Parser_1 = require("./ProjectV1Parser");
const ProjectV2Parser_1 = require("./ProjectV2Parser");
const Parser_1 = require("../Parser");
class ProjectParser extends Parser_1.Parser {
    getScope() {
        return 'project';
    }
    getWorkersMap() {
        return {
            '1': ProjectV1Parser_1.ProjectV1Parser,
            '2': ProjectV2Parser_1.ProjectV2Parser,
        };
    }
}
exports.ProjectParser = ProjectParser;
//# sourceMappingURL=ProjectParser.js.map