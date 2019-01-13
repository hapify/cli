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
const globalConfig = typedi_1.Container.get(service_1.GlobalConfigService);
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const writer = typedi_1.Container.get(service_1.WriterService);
const http = typedi_1.Container.get(service_1.HttpServerService);
const channelsService = typedi_1.Container.get(service_1.ChannelsService);
// ############################################
// Common methods
const logChannel = (channel) => {
    logger.info(`Found channel ${chalk_1.default.yellow(channel.name)} in ${chalk_1.default.blueBright(channel.path)}`);
};
const cChannel = chalk_1.default.yellow;
const cModel = chalk_1.default.magentaBright;
const cPath = chalk_1.default.blueBright;
const cHigh = chalk_1.default.green;
// ############################################
// Define program & actions
program
    .version('0.3.0')
    .description('Hapify Command Line Tool')
    .option('--debug', 'enable debug mode')
    .option('-d, --dir <path>', 'change the working directory')
    .option('-k, --key <secret>', 'define the api key to use (override global key)');
program
    .command('config')
    .alias('f')
    .description('Define global configuration')
    .option('--apiKey <secret>', 'define the api key to use for every commands')
    .action((cmd) => __awaiter(this, void 0, void 0, function* () {
    try {
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        // Get actual values
        const data = globalConfig.getData();
        const updates = [];
        // Update values
        if (cmd.apiKey) {
            data.apiKey = cmd.apiKey;
            updates.push('apiKey');
        }
        // Store values
        globalConfig.setData(data);
        if (updates.length) {
            logger.success(`Did update global configuration: ${updates.join(', ')}`);
        }
        else {
            logger.warning(`Nothing updated`);
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
    .command('list')
    .alias('l')
    .description('List available channels from the current directory')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action((cmd) => __awaiter(this, void 0, void 0, function* () {
    try {
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const channels = yield channelsService.channels();
        for (const channel of channels) {
            logChannel(channel);
        }
        // Group channels by models collections
        const modelsCollections = {};
        for (const channel of channels) {
            if (typeof modelsCollections[channel.modelsCollection.path] === 'undefined') {
                modelsCollections[channel.modelsCollection.path] = [];
            }
            modelsCollections[channel.modelsCollection.path].push(channel);
        }
        const modelsPaths = Object.keys(modelsCollections);
        for (const modelsPath of modelsPaths) {
            const c = modelsCollections[modelsPath];
            const mc = c.length > 1;
            const m = yield c[0].modelsCollection.list();
            const mm = m.length > 1;
            let message = `Channel${mc ? 's' : ''} ${c.map(c => cChannel(c.name)).join(', ')} use${mc ? '' : 's'} model${mm ? 's' : ''} of ${cPath(modelsPath)}`;
            if (m.length === 0) {
                message += `\nThere is no model yet.`;
            }
            else {
                message += `\nThe model${mm ? 's are' : ' is'}:\n- ${m.map(m => cModel(m.name)).join('\n- ')}`;
            }
            logger.newLine().info(message);
        }
        logger.newLine();
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
        const channels = yield channelsService.channels();
        for (const channel of channels) {
            logChannel(channel);
        }
        for (const channel of channels) {
            const results = yield generator.runChannel(channel);
            yield writer.writeMany(channel.path, results);
            logger.success(`Generated ${cHigh(`${results.length} files`)} for channel ${cChannel(channel.name)}`);
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
        logChannel(channel);
        const outputPath = options.output() || Path.join(options.dir(), `${channel.name}.zip`);
        const results = yield generator.runChannel(channel);
        yield writer.zip(outputPath, results);
        logger.success(`Generated and zipped ${cHigh(`${results.length} files`)} for channel ${cChannel(channel.name)} to ${cPath(outputPath)}`);
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
        logger.success(`Created a new channel in ${cPath(options.dir())}`);
        // Action Ends
        // ---------------------------------
        logger.time();
    }
    catch (error) {
        logger.handle(error);
    }
}));
program
    .command('serve')
    .alias('s')
    .description('Start Hapify console for channel(s) and models edition')
    .option('-p, --port <n>', `the required port number (default between ${http.minPort} and ${http.maxPort})`)
    .option('-H, --hostname <hostname>', `the required hostname`, 'localhost')
    .option('--no-open', 'do not open a new tab in the browser')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action((cmd) => __awaiter(this, void 0, void 0, function* () {
    try {
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        yield http.serve();
        logger.info(`Server is running at: ${cPath(http.url())}`);
        if (options.open()) {
            http.open();
        }
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
process.on('exit', (code) => {
    http.stop();
});
// ############################################
// Init services
options.setProgram(program);
// ############################################
// Start program
program.parse(process.argv);
//# sourceMappingURL=index.js.map