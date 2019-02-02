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
	ServeCommand
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
	.version('0.3.0')
	.description('Hapify Command Line Tool')
	.option('--debug', 'enable debug mode')
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
	.alias('l')
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
	.command('init')
	.alias('i')
	.description('Init a new Hapify channel in the directory')
	.action(InitCommand);

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
