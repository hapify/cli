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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Commander = __importStar(require("commander"));
const Path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const class_1 = require("./class");
const typedi_1 = require("typedi");
const service_1 = require("./service");
// ############################################
// Get services
const program = Commander.default;
const generator = typedi_1.Container.get(service_1.GeneratorService);
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const writer = typedi_1.Container.get(service_1.WriterService);
// ############################################
// Define program & actions
program
    .version('0.1.0')
    .description('Hapify Command Line Tool')
    .option('--debug', 'enable debug mode')
    .option('-d, --dir <path>', 'change the working directory');
program
    .command('list')
    .alias('l')
    .description('List available channels from the current directory')
    .action((cmd) => __awaiter(this, void 0, void 0, function* () {
    try {
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const channels = class_1.Channel.sniff(options.dir(), options.depth());
        if (channels.length === 0) {
            throw new Error('No channel found');
        }
        for (const channel of channels) {
            yield channel.load();
            logger.raw(`Found channel ${chalk_1.default.yellow(channel.name)} in ${chalk_1.default.blueBright(channel.path)}`);
        }
        // Group channels by models collections
        const modelsCollections = {};
        for (const channel of channels) {
            if (typeof modelsCollections[channel.modelsCollection.modelsPath] === 'undefined') {
                modelsCollections[channel.modelsCollection.modelsPath] = [];
            }
            modelsCollections[channel.modelsCollection.modelsPath].push(channel);
        }
        const modelsPaths = Object.keys(modelsCollections);
        for (const modelsPath of modelsPaths) {
            const c = modelsCollections[modelsPath];
            const mc = c.length > 1;
            const m = yield c[0].modelsCollection.list();
            const mm = m.length > 1;
            let message = `\nChannel${mc ? 's' : ''} ${c.map(c => chalk_1.default.yellow(c.name)).join(', ')} use${mc ? '' : 's'} model${mm ? 's' : ''} in ${chalk_1.default.blueBright(modelsPath)}`;
            message += `\nThe model${mm ? 's are' : ' is'}: ${m.map(m => chalk_1.default.magentaBright(m.name)).join(', ')}`;
            logger.raw(message);
        }
        // Action Ends
        // ---------------------------------
        logger.time();
    }
    catch (error) {
        logger.handle(error);
    }
}));
program
    .command('generate')
    .alias('g')
    .description('Generate channel(s) from current directory')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action((cmd) => __awaiter(this, void 0, void 0, function* () {
    try {
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const channels = class_1.Channel.sniff(options.dir(), options.depth());
        if (channels.length === 0) {
            throw new Error('No channel found');
        }
        for (const channel of channels) {
            yield channel.load();
            logger.raw(`Found channel ${chalk_1.default.yellow(channel.name)}`);
        }
        for (const channel of channels) {
            const results = yield generator.runChannel(channel);
            yield writer.writeMany(channel.path, results);
            logger.success(`=> Generated ${results.length} files for channel ${channel.name}`);
        }
        // Action Ends
        // ---------------------------------
        logger.time();
    }
    catch (error) {
        logger.handle(error);
    }
}));
program
    .command('export')
    .alias('x')
    .description('Export channel as ZIP from current directory')
    .option('-o, --output <path>', 'output file path')
    .action((cmd) => __awaiter(this, void 0, void 0, function* () {
    try {
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const channel = new class_1.Channel(options.dir());
        yield channel.load();
        logger.raw(`Found channel ${chalk_1.default.yellow(channel.name)}`);
        const outputPath = options.output() || Path.join(options.dir(), `${channel.name}.zip`);
        const results = yield generator.runChannel(channel);
        yield writer.zip(outputPath, results);
        logger.success(`=> Generated and zipped ${results.length} files for channel ${channel.name} to ${outputPath}`);
        // Action Ends
        // ---------------------------------
        logger.time();
    }
    catch (error) {
        logger.handle(error);
    }
}));
program
    .command('create')
    .alias('c')
    .description('Create a new Hapify channel in the directory')
    .action((cmd) => __awaiter(this, void 0, void 0, function* () {
    try {
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        yield class_1.Channel.create(options.dir());
        logger.success(`=> Created a new channel in ${options.dir()}`);
        // Action Ends
        // ---------------------------------
        logger.time();
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
options.setProgram(program);
// ############################################
// Start program
program.parse(process.argv);
//# sourceMappingURL=index.js.map