#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Commander = __importStar(require("commander"));
const typedi_1 = require("typedi");
const service_1 = require("./service");
const command_1 = require("./command");
// ############################################
// Get services
const program = Commander.default;
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const http = typedi_1.Container.get(service_1.HttpServerService);
// ############################################
// Define program & actions
program
    .version('0.5.1')
    .description('Hapify Command Line Tool')
    .option('--debug', 'enable debug mode', false)
    .option('-d, --dir <path>', 'change the working directory')
    .option('-k, --key <secret>', 'override global api key for this command (If you want to define your api key permanently, you should use command "hpf key")');
program
    .command('config')
    .description('Define global configuration')
    .option('--apiKey <secret>', 'define the api key to use permanently')
    .option('--apiUrl <url>', 'override default api url')
    .action(command_1.ConfigCommand);
program
    .command('key <key>')
    .description('Define the api key to use permanently')
    .action(command_1.KeyCommand);
program
    .command('list')
    .alias('ls')
    .description('List available channels from the current directory')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action(command_1.ListCommand);
program
    .command('generate')
    .alias('g')
    .description('Generate channel(s) from current directory')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action(command_1.GenerateCommand);
program
    .command('export')
    .alias('x')
    .description('Export channel as ZIP from current directory')
    .option('-o, --output <path>', 'output file path')
    .action(command_1.ExportCommand);
program
    .command('import')
    .alias('m')
    .description('Import pre-defined models from cloud')
    .option('--preset [id]', 'ids of presets to preload', (val, acc) => {
    acc.push(val);
    return acc;
}, [])
    .action(command_1.ImportCommand);
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
    .action(command_1.NewCommand);
program
    .command('init')
    .alias('i')
    .option('-p, --project <id>', 'id of the project to use')
    .option('--project-name <name>', 'name of the project to create')
    .option('--project-desc <description>', 'description of the project to create (name must be defined)')
    .description('Init a new Hapify channel in the directory')
    .action(command_1.InitCommand);
program
    .command('use')
    .alias('u')
    .option('-p, --project <id>', 'id of the project to use')
    .option('--project-name <name>', 'name of the project to create')
    .option('--project-desc <description>', 'description of the project to create (name must be defined)')
    .description('Change the project used by existing channel(s)')
    .action(command_1.UseCommand);
program
    .command('patch')
    .alias('p')
    .description('Compute patch between two commits and apply it to another branch')
    .action(command_1.PatchCommand);
program
    .command('serve')
    .alias('s')
    .description('Start Hapify console for channel(s) and models edition')
    .option('-p, --port <n>', `the required port number (default between ${http.minPort} and ${http.maxPort})`)
    .option('-H, --hostname <hostname>', `the required hostname`, 'localhost')
    .option('--no-open', 'do not open a new tab in the browser')
    .option('--depth <n>', 'depth to recursively look for channels', 2)
    .action(command_1.ServeCommand);
// ############################################
// Init services
process.on('exit', code => {
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
    program.outputHelp(help => {
        return `${logger.getArt()}\n\n${help}`;
    });
}
//# sourceMappingURL=index.js.map