#!/usr/bin/env node

import * as Commander from 'commander';
import { CommanderStatic } from 'commander';
import { Container } from 'typedi';
import { OptionsService, LoggerService, HttpServerService } from './service';
import {
	ConfigCommand,
	ExportCommand,
	GenerateCommand,
	InitCommand,
	KeyCommand,
	ListCommand,
	NewCommand,
	ImportCommand,
	ServeCommand,
	PatchCommand
} from './command';

// ############################################
// Get services
const program: CommanderStatic = Commander.default;
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const http = Container.get(HttpServerService);

// ############################################
// Define program & actions
program
	.version('0.4.0')
	.description('Hapify Command Line Tool')
	.option('--staging', 'use staging api', false)
	.option('--debug', 'enable debug mode', false)
	.option('-d, --dir <path>', 'change the working directory')
	.option(
		'-k, --key <secret>',
		'define the api key to use (override global key)'
	);

program
	.command('config')
	.description('Define global configuration')
	.option('--apiKey <secret>', 'define the api key to use for every commands')
	.action(ConfigCommand);

program
	.command('key <key>')
	.description('Define the api key to use')
	.action(KeyCommand);

program
	.command('list')
	.alias('ls')
	.description('List available channels from the current directory')
	.option('--depth <n>', 'depth to recursively look for channels', 2)
	.action(ListCommand);

program
	.command('generate')
	.alias('g')
	.description('Generate channel(s) from current directory')
	.option('--depth <n>', 'depth to recursively look for channels', 2)
	.action(GenerateCommand);

program
	.command('export')
	.alias('x')
	.description('Export channel as ZIP from current directory')
	.option('-o, --output <path>', 'output file path')
	.action(ExportCommand);

program
	.command('import')
	.alias('m')
	.description('Import pre-defined models from cloud')
	.option(
		'--preset [id]',
		'ids of presets to preload',
		(val, acc) => {
			acc.push(val);
			return acc;
		},
		[]
	)
	.action(ImportCommand);

program
	.command('new')
	.alias('n')
	.option('-p, --project <id>', 'id of the project to use')
	.option('--project-name <name>', 'name of the project to create')
	.option(
		'--project-desc <description>',
		'description of the project to create (name must be defined)'
	)
	.option('-b, --boilerplate <slug>', 'slug-name of the boilerplate to clone')
	.option('--boilerplate-id <id>', 'id of the boilerplate to clone')
	.option('--boilerplate-url <url>', 'url of the boilerplate to clone')
	.option(
		'--preset [id]',
		'ids of presets to preload',
		(val, acc) => {
			acc.push(val);
			return acc;
		},
		[]
	)
	.description('Clone and init a boilerplate')
	.action(NewCommand);

program
	.command('init')
	.alias('i')
	.option('-p, --project <id>', 'id of the project to use')
	.option('--project-name <name>', 'name of the project to create')
	.option(
		'--project-desc <description>',
		'description of the project to create (name must be defined)'
	)
	.description('Init a new Hapify channel in the directory')
	.action(InitCommand);

program
	.command('patch')
	.alias('p')
	.description(
		'Compute patch between two commits and apply it to another branch'
	)
	.action(PatchCommand);

program
	.command('serve')
	.alias('s')
	.description('Start Hapify console for channel(s) and models edition')
	.option(
		'-p, --port <n>',
		`the required port number (default between ${http.minPort} and ${
			http.maxPort
		})`
	)
	.option('-H, --hostname <hostname>', `the required hostname`, 'localhost')
	.option('--no-open', 'do not open a new tab in the browser')
	.option('--depth <n>', 'depth to recursively look for channels', 2)
	.action(ServeCommand);

// ############################################
// If no arguments, show help
if (!process.argv.slice(2).length) {
	logger.art();
	logger.newLine();
	program.outputHelp();
	process.exit();
}

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
program.parse(process.argv);
