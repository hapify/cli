#!/usr/bin/env node

import * as Commander from 'commander';
import * as Path from 'path';
import chalk from 'chalk';
import { CommanderStatic } from 'commander';
import { Channel } from './class';
import { Container } from 'typedi';
import { GeneratorService, OptionsService, LoggerService, WriterService, HttpServerService, ChannelsService } from './service';

// ############################################
// Get services
const program: CommanderStatic = Commander.default;
const generator = Container.get(GeneratorService);
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const writer = Container.get(WriterService);
const http = Container.get(HttpServerService);
const channelsService = Container.get(ChannelsService);

// ############################################
// Common methods
const logChannel = (channel: Channel) => {
  logger.info(`Found channel ${chalk.yellow(channel.name)} in ${chalk.blueBright(channel.path)}`);
};
const cChannel = chalk.yellow;
const cModel = chalk.magentaBright;
const cPath = chalk.blueBright;
const cHigh = chalk.green;

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
    const channels = await channelsService.channels();

    for (const channel of channels) {
      logChannel(channel);
    }

    // Group channels by models collections
    const modelsCollections: { [s: string]: Channel[] } = {};
    for (const channel of channels) {
      if (typeof modelsCollections[channel.modelsCollection.path()] === 'undefined') {
        modelsCollections[channel.modelsCollection.path()] = [];
      }
      modelsCollections[channel.modelsCollection.path()].push(channel);
    }

    const modelsPaths = Object.keys(modelsCollections);
    for (const modelsPath of modelsPaths) {
      const c: Channel[] = modelsCollections[modelsPath];
      const mc = c.length > 1;
      const m = await c[0].modelsCollection.list();
      const mm = m.length > 1;
      let message = `Channel${mc ? 's' : ''} ${c.map(c => cChannel(c.name)).join(', ')} use${mc ? '' : 's'} model${mm ? 's' : ''} in ${cPath(modelsPath)}`;
      if (m.length === 0) {
        message += `\nThere is no model yet.`;
      } else {
        message += `\nThe model${mm ? 's are' : ' is'}:\n- ${m.map(m => cModel(m.name)).join('\n- ')}`;
      }
      logger.newLine().info(message);
    }
    logger.newLine();

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
    const channels = await channelsService.channels();

    for (const channel of channels) {
      logChannel(channel);
    }

    for (const channel of channels) {
      const results = await generator.runChannel(channel);
      await writer.writeMany(channel.path, results);
      logger.success(`Generated ${cHigh(`${results.length} files`)} for channel ${cChannel(channel.name)}`);
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
    logChannel(channel);

    const outputPath = options.output() || Path.join(options.dir(), `${channel.name}.zip`);

    const results = await generator.runChannel(channel);
    await writer.zip(outputPath, results);
    logger.success(`Generated and zipped ${cHigh(`${results.length} files`)} for channel ${cChannel(channel.name)} to ${cPath(outputPath)}`);
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
    logger.success(`Created a new channel in ${cPath(options.dir())}`);
    // Action Ends
    // ---------------------------------

    logger.time(); } catch (error) { logger.handle(error); }
  });

program
  .command('serve')
  .alias('s')
  .description('Start Hapify console for edition')
  .option('-p, --port <n>', `the required port number (default between ${http.minPort} and ${http.maxPort})`)
  .option('-H, --hostname <hostname>', `the required hostname`, 'localhost')
  .option('--no-open', 'do not open a new tab in the browser')
  .action(async (cmd) => { try { options.setCommand(cmd);

    // ---------------------------------
    // Action starts
    await http.serve();
    logger.info(`Server is running at: ${cPath(http.url())}`);
    if (options.open()) { http.open(); }
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
process.on('exit', (code) => {
  http.stop();
});

// ############################################
// Init services
options.setProgram(program);


// ############################################
// Start program
program.parse(process.argv);
