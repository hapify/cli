import { Container } from 'typedi';
import { Command } from 'commander';
import { GlobalConfigService } from '../service/GlobalConfig';
import { OptionsService } from '../service/Options';
import { LoggerService } from '../service/Logger';

// ############################################
// Get services
const globalConfig = Container.get(GlobalConfigService);
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);

export async function KeyCommand(key: string, cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts

		// Get actual values
		const data = globalConfig.getData();
		data.apiKey = key;

		// Store values
		globalConfig.setData(data);

		logger.success(`Did update global api key`);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
