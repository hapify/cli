import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService } from '../service/Options';
import { ChannelsService } from '../service/Channels';
import { LoggerService } from '../service/Logger';
import { ApplyPreset, AskPreset } from './question/Preset';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const channelsService = Container.get(ChannelsService);

export async function ImportCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		await channelsService.ensureSameProject();
		await channelsService.ensureSameDefaultFields();

		// =================================
		// Get presets
		const qPresets = await AskPreset(cmd);

		// =================================
		// Get models and apply presets if necessary
		await ApplyPreset(qPresets);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
