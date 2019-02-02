import { Channel } from '../class';
import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService } from '../service';
import { cPath } from './helpers';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);

export async function InitCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		await Channel.create(options.dir());
		logger.success(`Created a new channel in ${cPath(options.dir())}`);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
