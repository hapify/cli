#!/usr/bin/env node

import * as Commander from 'commander';
import { CommanderStatic } from 'commander';

const commander: CommanderStatic = Commander.default;

commander
  .version('0.1.0')
  .description('Hapify Command Line Tool')
  .outputHelp();


