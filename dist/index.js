#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Commander = __importStar(require("commander"));
const class_1 = require("./class");
const typedi_1 = require("typedi");
const service_1 = require("./service");
// ############################################
// Get services
const program = Commander.default;
const generator = typedi_1.Container.get(service_1.GeneratorService);
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
// ############################################
// Define program & actions
program
    .version('0.1.0')
    .description('Hapify Command Line Tool')
    .option('--debug', 'enable debug mode')
    .option('-d, --dir <path>', 'change the working directory');
program
    .command('generate')
    .alias('g')
    .description('Start console for current directory')
    .action(() => __awaiter(this, void 0, void 0, function* () {
    try {
        const channel = new class_1.Channel(options.dir());
        yield channel.load();
        yield generator.compile(channel, channel.templates[0]);
    }
    catch (error) {
        logger.handle(error);
    }
}));
// ############################################
// If no arguments, show help
if (!process.argv.slice(2).length) {
    logger.art();
    program.outputHelp();
    process.exit();
}
// ############################################
// Init services
options.attach(program);
// ############################################
// Start program
program.parse(process.argv);
//# sourceMappingURL=index.js.map