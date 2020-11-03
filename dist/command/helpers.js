"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cMedium = exports.cHigh = exports.cImportant = exports.cPath = exports.cModel = exports.cChannel = exports.logChannel = void 0;
const chalk_1 = __importDefault(require("chalk"));
const typedi_1 = require("typedi");
const Logger_1 = require("../service/Logger");
// Common methods
exports.logChannel = (channel) => {
    const logger = typedi_1.Container.get(Logger_1.LoggerService);
    logger.info(`Found channel ${chalk_1.default.yellow(channel.name)} in ${chalk_1.default.blueBright(channel.path)}`);
};
exports.cChannel = chalk_1.default.yellow;
exports.cModel = chalk_1.default.magentaBright;
exports.cPath = chalk_1.default.blueBright;
exports.cImportant = chalk_1.default.green.bold;
exports.cHigh = chalk_1.default.green;
exports.cMedium = chalk_1.default.yellow;
//# sourceMappingURL=helpers.js.map