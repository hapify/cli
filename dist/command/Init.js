"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = require("../class");
const typedi_1 = require("typedi");
const service_1 = require("../service");
const helpers_1 = require("./helpers");
// ############################################
// Get services
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
function InitCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            options.setCommand(cmd);
            // ---------------------------------
            // Action starts
            yield class_1.Channel.create(options.dir());
            logger.success(`Created a new channel in ${helpers_1.cPath(options.dir())}`);
            // Action Ends
            // ---------------------------------
            logger.time();
        }
        catch (error) {
            logger.handle(error);
        }
    });
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=Init.js.map