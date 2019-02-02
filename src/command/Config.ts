import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService, GlobalConfigService } from '../service';

// ############################################
// Get services
const globalConfig = Container.get(GlobalConfigService);
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);

export async function ConfigCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		// Get actual values
		const data = globalConfig.getData();

		const updates = [];

		// Update values
		if (cmd.apiKey) {
			data.apiKey = cmd.apiKey;
			updates.push('apiKey');
		}

		// Store values
		globalConfig.setData(data);

		if (updates.length) {
			logger.success(
				`Did update global configuration: ${updates.join(', ')}`
			);
		} else {
			logger.warning(`Nothing updated`);
		}
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
