#!/usr/bin/env node

import * as Commander from 'commander';
import { CommanderStatic } from 'commander';
import { Channel } from './class';
import { Container } from 'typedi';
import { GeneratorService, OptionsService, LoggerService } from './service';

// ############################################
// Get services
const program: CommanderStatic = Commander.default;
const generator = Container.get(GeneratorService);
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);

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
  .action(async () => {
    try {
      const channel = new Channel(options.dir());
      await channel.load();

      await generator.compile(channel, channel.templates[0]);
    } catch (error) { logger.handle(error); }
  });

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
