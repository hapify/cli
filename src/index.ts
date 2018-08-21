#!/usr/bin/env node

import * as Commander from 'commander';
import chalk from 'chalk';
import { CommanderStatic } from 'commander';
import Bootstrap from './class/Bootstrap';

const commander: CommanderStatic = Commander.default;

commander
  .version('0.1.0')
  .description('Hapify Command Line Tool');

commander
  .command('start')
  .alias('s')
  .description('Start console for current directory')
  .action(() => {
    console.log(chalk.magentaBright('Loaded'));
    const bootstrap = new Bootstrap('tests/hapijs');
  });

// If no arguments, show help
if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}

commander.parse(process.argv);
