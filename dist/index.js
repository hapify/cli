#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Commander = __importStar(require("commander"));
const typedi_1 = require("typedi");
const Options_1 = require("./service/Options");
const Logger_1 = require("./service/Logger");
const HttpServer_1 = require("./service/HttpServer");
const Key_1 = require("./command/Key");
const Config_1 = require("./command/Config");
const List_1 = require("./command/List");
const Generate_1 = require("./command/Generate");
const Export_1 = require("./command/Export");
const Import_1 = require("./command/Import");
const New_1 = require("./command/New");
const Init_1 = require("./command/Init");
const Use_1 = require("./command/Use");
const Serve_1 = require("./command/Serve");
const Patch_1 = require("./command/Patch");
// ############################################
// Get services
const program = Commander.default;
const options = typedi_1.Container.get(Options_1.OptionsService);
const logger = typedi_1.Container.get(Logger_1.LoggerService);
const http = typedi_1.Container.get(HttpServer_1.HttpServerService);
// ############################################
// Define program & actions
program
    .version('0.5.6')
    .description('Hapify Command Line Tool')
    .option('--debug', 'enable debug mode', false)
    .option('-d, --dir <path>', 'change the working directory')
    .option('-k, --key <secret>', 'override global api key for this command (If you want to define your api key permanently, you should use command "hpf key")');
program
    .command('config')
    .description('Define global configuration')
    .option('--apiKey <secret>', 'define the api key to use permanently')
    .option('--apiUrl <url>', 'override default api url')
    .action(Config_1.ConfigCommand);
program.command('key <key>').description('Define the api key to use permanently').action(Key_1.KeyCommand);
program
    .command('list')
    .alias('ls')
    .description('List available channels from the current directory')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action(List_1.ListCommand);
program
    .command('generate')
    .alias('g')
    .description('Generate channel(s) from current directory')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action(Generate_1.GenerateCommand);
program
    .command('export')
    .alias('x')
    .description('Export channel as ZIP from current directory')
    .option('-o, --output <path>', 'output file path')
    .action(Export_1.ExportCommand);
program
    .command('import')
    .alias('m')
    .description('Import pre-defined models from cloud')
    .option('--preset [id]', 'ids of presets to preload', (val, acc) => {
    acc.push(val);
    return acc;
}, [])
    .action(Import_1.ImportCommand);
program
    .command('new')
    .alias('n')
    .option('-p, --project <id>', 'id of the project to use')
    .option('--project-name <name>', 'name of the project to create')
    .option('--project-desc <description>', 'description of the project to create (name must be defined)')
    .option('-b, --boilerplate <slug>', 'slug-name of the boilerplate to clone')
    .option('--boilerplate-id <id>', 'id of the boilerplate to clone')
    .option('--boilerplate-url <url>', 'url of the boilerplate to clone')
    .option('--preset [id]', 'ids of presets to preload', (val, acc) => {
    acc.push(val);
    return acc;
}, [])
    .description('Clone and init a boilerplate')
    .action(New_1.NewCommand);
program
    .command('init')
    .alias('i')
    .option('-p, --project <id>', 'id of the project to use')
    .option('--project-name <name>', 'name of the project to create')
    .option('--project-desc <description>', 'description of the project to create (name must be defined)')
    .option('--channel-name <name>', 'name of the channel to init')
    .option('--channel-desc <description>', 'description of the channel to init')
    .option('--channel-logo <url>', 'url of the logo of the channel to init')
    .description('Init a new Hapify channel in the directory')
    .action(Init_1.InitCommand);
program
    .command('use')
    .alias('u')
    .option('-p, --project <id>', 'id of the project to use')
    .option('--project-name <name>', 'name of the project to create')
    .option('--project-desc <description>', 'description of the project to create (name must be defined)')
    .description('Change the project used by existing channel(s)')
    .action(Use_1.UseCommand);
program.command('patch').alias('p').description('Compute patch between two commits and apply it to another branch').action(Patch_1.PatchCommand);
program
    .command('serve')
    .alias('s')
    .description('Start Hapify console for channel(s) and models edition')
    .option('-p, --port <n>', `the required port number (default between ${http.minPort} and ${http.maxPort})`)
    .option('-H, --hostname <hostname>', `the required hostname`, 'localhost')
    .option('--no-open', 'do not open a new tab in the browser')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action(Serve_1.ServeCommand);
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
const parsed = program.parse(process.argv);
// If no command, show help
if (!parsed.args.length) {
    program.outputHelp((help) => {
        return `${logger.getArt()}\n\n${help}`;
    });
}
//# sourceMappingURL=index.js.map