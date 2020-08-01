import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService, HttpServerService, ChannelsService } from '../service';
import { cPath } from './helpers';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const http = Container.get(HttpServerService);
const channelsService = Container.get(ChannelsService);

export async function ServeCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		await channelsService.ensureSameProject();
		await channelsService.ensureSameDefaultFields();
		await http.serve();
		logger.info(`Server is running at: ${cPath(http.url())}`);
		if (options.open()) {
			http.open();
		}
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
