"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cHigh = exports.cPath = exports.cModel = exports.cChannel = exports.logChannel = void 0;
const chalk_1 = __importDefault(require("chalk"));
const typedi_1 = require("typedi");
const Logger_1 = require("../service/Logger");
const logger = typedi_1.Container.get(Logger_1.LoggerService);
// ############################################
// Common methods
exports.logChannel = (channel) => {
    logger.info(`Found channel ${chalk_1.default.yellow(channel.name)} in ${chalk_1.default.blueBright(channel.path)}`);
};
exports.cChannel = chalk_1.default.yellow;
exports.cModel = chalk_1.default.magentaBright;
exports.cPath = chalk_1.default.blueBright;
exports.cHigh = chalk_1.default.green;
//# sourceMappingURL=helpers.js.map