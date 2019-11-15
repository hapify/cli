#!/usr/bin/env node
/*! hapify-cli 2019-11-15 */

"use strict";var __importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var o={};if(null!=e)for(var t in e)Object.hasOwnProperty.call(e,t)&&(o[t]=e[t]);return o.default=e,o};Object.defineProperty(exports,"__esModule",{value:!0});const Commander=__importStar(require("commander")),typedi_1=require("typedi"),service_1=require("./service"),command_1=require("./command"),program=Commander.default,options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService),http=typedi_1.Container.get(service_1.HttpServerService);program.version("0.5.4").description("Hapify Command Line Tool").option("--debug","enable debug mode",!1).option("-d, --dir <path>","change the working directory").option("-k, --key <secret>",'override global api key for this command (If you want to define your api key permanently, you should use command "hpf key")'),program.command("config").description("Define global configuration").option("--apiKey <secret>","define the api key to use permanently").option("--apiUrl <url>","override default api url").action(command_1.ConfigCommand),program.command("key <key>").description("Define the api key to use permanently").action(command_1.KeyCommand),program.command("list").alias("ls").description("List available channels from the current directory").option("--depth <n>","depth to recursively look for channels",2).action(command_1.ListCommand),program.command("generate").alias("g").description("Generate channel(s) from current directory").option("--depth <n>","depth to recursively look for channels",2).action(command_1.GenerateCommand),program.command("export").alias("x").description("Export channel as ZIP from current directory").option("-o, --output <path>","output file path").action(command_1.ExportCommand),program.command("import").alias("m").description("Import pre-defined models from cloud").option("--preset [id]","ids of presets to preload",(e,o)=>(o.push(e),o),[]).action(command_1.ImportCommand),program.command("new").alias("n").option("-p, --project <id>","id of the project to use").option("--project-name <name>","name of the project to create").option("--project-desc <description>","description of the project to create (name must be defined)").option("-b, --boilerplate <slug>","slug-name of the boilerplate to clone").option("--boilerplate-id <id>","id of the boilerplate to clone").option("--boilerplate-url <url>","url of the boilerplate to clone").option("--preset [id]","ids of presets to preload",(e,o)=>(o.push(e),o),[]).description("Clone and init a boilerplate").action(command_1.NewCommand),program.command("init").alias("i").option("-p, --project <id>","id of the project to use").option("--project-name <name>","name of the project to create").option("--project-desc <description>","description of the project to create (name must be defined)").option("--channel-name <name>","name of the channel to init").option("--channel-desc <description>","description of the channel to init").option("--channel-logo <url>","url of the logo of the channel to init").description("Init a new Hapify channel in the directory").action(command_1.InitCommand),program.command("use").alias("u").option("-p, --project <id>","id of the project to use").option("--project-name <name>","name of the project to create").option("--project-desc <description>","description of the project to create (name must be defined)").description("Change the project used by existing channel(s)").action(command_1.UseCommand),program.command("patch").alias("p").description("Compute patch between two commits and apply it to another branch").action(command_1.PatchCommand),program.command("serve").alias("s").description("Start Hapify console for channel(s) and models edition").option("-p, --port <n>",`the required port number (default between ${http.minPort} and ${http.maxPort})`).option("-H, --hostname <hostname>","the required hostname","localhost").option("--no-open","do not open a new tab in the browser").option("--depth <n>","depth to recursively look for channels",2).action(command_1.ServeCommand),process.on("exit",e=>{http.stop()}),options.setProgram(program);const parsed=program.parse(process.argv);parsed.args.length||program.outputHelp(e=>`${logger.getArt()}\n\n${e}`);