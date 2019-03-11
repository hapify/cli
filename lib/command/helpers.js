"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const typedi_1 = require("typedi");
const service_1 = require("../service");
const logger = typedi_1.Container.get(service_1.LoggerService);
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