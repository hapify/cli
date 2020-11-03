#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const Logger_1 = require("./service/Logger");
const Program_1 = require("./class/Program");
// ############################################
// Get services
const logger = typedi_1.Container.get(Logger_1.LoggerService);
// ############################################
// Start program
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield new Program_1.Program().run(process.argv);
            logger.time();
        }
        catch (error) {
            if (error.code !== 'commander.help') {
                logger.handleAndExit(error);
            }
        }
    });
}
run().catch((error) => logger.handleAndExit(error));
//# sourceMappingURL=index.js.map