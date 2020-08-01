import chalk from 'chalk';
import { Container } from 'typedi';
import { LoggerService } from '../service/Logger';
import { Channel } from '../class/Channel';

const logger = Container.get(LoggerService);

// ############################################
// Common methods
export const logChannel = (channel: Channel) => {
	logger.info(`Found channel ${chalk.yellow(channel.name)} in ${chalk.blueBright(channel.path)}`);
};
export const cChannel = chalk.yellow;
export const cModel = chalk.magentaBright;
export const cPath = chalk.blueBright;
export const cHigh = chalk.green;
