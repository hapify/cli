#!/usr/bin/env node

import * as Commander from 'commander';
import { CommanderStatic } from 'commander';
import { Channel } from './class';
import { Container } from 'typedi';
import { GeneratorService, OptionsService, LoggerService, WriterService } from './service';

// ############################################
// Get services
const program: CommanderStatic = Commander.default;
const generator = Container.get(GeneratorService);
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const writer = Container.get(WriterService);

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
  .description('Generate console for current directory')
  .option('--depth <n>', 'depth to recursively look for channels', 2)
  .action(async (cmd) => { try { options.setCommand(cmd);

      // ---------------------------------
      // Action starts
      const channels: Channel[] = Channel.sniff(options.dir(), options.depth());

      if (channels.length === 0) {
        throw new Error('No channel found');
      }

      for (const channel of channels) {
        await channel.load();
        logger.info(`Found channel ${channel.name}`);
      }

      for (const channel of channels) {
        const results = await generator.runChannel(channel);
        writer.writeMany(channel.path, results);
        logger.success(`=> Generated ${results.length} files for channel ${channel.name}`);
      }
    // Action Ends
    // ---------------------------------

    logger.time(); } catch (error) { logger.handle(error); }
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
options.setProgram(program);


// ############################################
// Start program
program.parse(process.argv);
