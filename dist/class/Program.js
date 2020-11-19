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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const commander_1 = __importDefault(require("commander"));
const typedi_1 = require("typedi");
const HttpServer_1 = require("../service/HttpServer");
const Config_1 = require("../command/Config");
const Key_1 = require("../command/Key");
const List_1 = require("../command/List");
const Generate_1 = require("../command/Generate");
const Export_1 = require("../command/Export");
const Import_1 = require("../command/Import");
const New_1 = require("../command/New");
const Init_1 = require("../command/Init");
const Use_1 = require("../command/Use");
const Patch_1 = require("../command/Patch");
const Serve_1 = require("../command/Serve");
const Options_1 = require("../service/Options");
const packageJson = require('../../package.json');
function Aggregate(val, acc) {
    acc.push(val);
    return acc;
}
class Program {
    constructor() {
        this.program = new commander_1.default.Command();
        this.http = typedi_1.Container.get(HttpServer_1.HttpServerService);
        this.options = typedi_1.Container.get(Options_1.OptionsService);
        this.options.setProgram(this.program);
        this.init();
    }
    run(argv) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.program.parseAsync(argv);
        });
    }
    init() {
        this.program
            .version(packageJson.version)
            .description('Hapify Command Line Tool')
            .option('--debug', 'enable debug mode', false)
            .option('--silent', 'enable silent mode', false)
            .option('-d, --dir <path>', 'change the working directory')
            .option('-k, --key <secret>', 'override global API key for this command (If you want to define your API key permanently, you should use command "hpf key")');
        this.program
            .command('config')
            .description('Define global configuration')
            .option('--apiKey <secret>', 'define the API key to use permanently')
            .option('--apiUrl <url>', 'override default API url')
            .action(Config_1.ConfigCommand);
        this.program.command('key <key>').description('Define the API key to use permanently').action(Key_1.KeyCommand);
        this.program
            .command('list')
            .alias('ls')
            .description('List available channels from the current directory')
            .option('--depth <n>', 'depth for channels discovery', '2')
            .action(List_1.ListCommand);
        this.program
            .command('generate')
            .alias('g')
            .description('Generate channel(s) from current directory')
            .option('--depth <n>', 'depth for channels discovery', '2')
            .action(Generate_1.GenerateCommand);
        this.program
            .command('export')
            .alias('x')
            .description('Export channel as ZIP from current directory')
            .option('-o, --output <path>', 'output file path')
            .action(Export_1.ExportCommand);
        this.program
            .command('import')
            .alias('m')
            .description('Import pre-defined models from cloud')
            .option('--preset [id]', 'IDs of presets to preload', Aggregate, [])
            .action(Import_1.ImportCommand);
        this.program
            .command('new')
            .alias('n')
            .option('-p, --project <id>', 'ID of the project to use')
            .option('-b, --boilerplate <slug>', 'slug-name of the boilerplate to clone')
            .option('--boilerplate-id <id>', 'ID of the boilerplate to clone')
            .option('--boilerplate-url [url]', 'urls of the boilerplates to clone', Aggregate, [])
            .option('--preset [id]', 'ID of presets to preload', Aggregate, [])
            .option('--no-presets', 'do not prompt for presets')
            .option('--project-name <name>', 'name of the project to create')
            .option('--project-desc <description>', 'description of the project to create (name must be defined)')
            .description('Clone and init a boilerplate')
            .action(New_1.NewCommand);
        this.program
            .command('init')
            .alias('i')
            .option('--channel-name <name>', 'name of the channel to init')
            .option('--channel-desc <description>', 'description of the channel to init')
            .option('--channel-logo <url>', 'url of the logo of the channel to init')
            .option('--project-name <name>', 'name of the project to create')
            .option('--project-desc <description>', 'description of the project to create (name must be defined)')
            .description('Init a new Hapify channel in the directory')
            .action(Init_1.InitCommand);
        this.program
            .command('use')
            .alias('u')
            .option('-p, --project <id>', 'ID of the project to use')
            .option('--project-name <name>', 'name of the project to create')
            .option('--project-desc <description>', 'description of the project to create (name must be defined)')
            .description('Change the project used by existing channel(s)')
            .action(Use_1.UseCommand);
        this.program.command('patch').alias('p').description('Compute patch between two commits and apply it to another branch').action(Patch_1.PatchCommand);
        this.program
            .command('serve')
            .alias('s')
            .description('Start Hapify console for channel(s) and models edition')
            .option('-p, --port <n>', `the required port number (default between ${this.http.minPort} and ${this.http.maxPort})`)
            .option('-H, --hostname <hostname>', `the required hostname`, 'localhost')
            .option('--no-open', 'do not open a new tab in the browser')
            .option('--depth <n>', 'depth for channels discovery', '2')
            .action(Serve_1.ServeCommand);
    }
}
exports.Program = Program;
//# sourceMappingURL=Program.js.map