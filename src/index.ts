#!/usr/bin/env node

import * as Commander from 'commander';
import * as Path from 'path';
import { CommanderStatic } from 'commander';
import { Channel, ModelsCollection } from './class';
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
  .command('list')
  .alias('l')
  .description('List available channels from the current directory')
  .action(async (cmd) => { try { options.setCommand(cmd);

    // ---------------------------------
    // Action starts
    const channels: Channel[] = Channel.sniff(options.dir(), options.depth());

    if (channels.length === 0) {
      throw new Error('No channel found');
    }

    for (const channel of channels) {
      await channel.load();
      logger.info(`Found channel ${channel.name} in ${channel.path}`);
    }

    // Group channels by models collections
    const modelsCollections: { [s: string]: Channel[] } = {};
    for (const channel of channels) {
      if (typeof modelsCollections[channel.modelsCollection.modelsPath] === 'undefined') {
        modelsCollections[channel.modelsCollection.modelsPath] = [];
      }
      modelsCollections[channel.modelsCollection.modelsPath].push(channel);
    }

    const modelsPaths = Object.keys(modelsCollections);
    for (const modelsPath of modelsPaths) {
      const c: Channel[] = modelsCollections[modelsPath];
      const mc = c.length > 1;
      const m = await c[0].modelsCollection.list();
      const mm = m.length > 1;
      let message = `\nChannel${mc ? 's' : ''} ${c.map(c => c.name).join(', ')} use${mc ? '' : 's'} model${mm ? 's' : ''} in ${modelsPath}`;
      message += `\nThe model${mm ? 's are' : ' is'}: ${m.map(m => m.name).join(', ')}`;
      logger.success(message);
    }

    // Action Ends
    // ---------------------------------

    logger.time(); } catch (error) { logger.handle(error); }
  });

program
  .command('generate')
  .alias('g')
  .description('Generate channel(s) from current directory')
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
      await writer.writeMany(channel.path, results);
      logger.success(`=> Generated ${results.length} files for channel ${channel.name}`);
    }
    // Action Ends
    // ---------------------------------

    logger.time(); } catch (error) { logger.handle(error); }
  });

program
  .command('export')
  .alias('x')
  .description('Export channel as ZIP from current directory')
  .option('-o, --output <path>', 'output file path')
  .action(async (cmd) => { try { options.setCommand(cmd);

    // ---------------------------------
    // Action starts
    const channel: Channel = new Channel(options.dir());
    await channel.load();
    logger.info(`Found channel ${channel.name}`);

    const outputPath = options.output() || Path.join(options.dir(), `${channel.name}.zip`);

    const results = await generator.runChannel(channel);
    await writer.zip(outputPath, results);
    logger.success(`=> Generated and zipped ${results.length} files for channel ${channel.name} to ${outputPath}`);
    // Action Ends
    // ---------------------------------

    logger.time(); } catch (error) { logger.handle(error); }
  });

program
  .command('create')
  .alias('c')
  .description('Create a new Hapify channel in the directory')
  .action(async (cmd) => { try { options.setCommand(cmd);

    // ---------------------------------
    // Action starts
    await Channel.create(options.dir());
    logger.success(`=> Created a new channel in ${options.dir()}`);
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
