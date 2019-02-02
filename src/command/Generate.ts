import { Container } from 'typedi';
import { Command } from 'commander';
import {
	GeneratorService,
	OptionsService,
	LoggerService,
	WriterService,
	ChannelsService
} from '../service';
import { logChannel, cChannel, cHigh } from './helpers';

// ############################################
// Get services
const generator = Container.get(GeneratorService);
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const writer = Container.get(WriterService);
const channelsService = Container.get(ChannelsService);

export async function GenerateCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		const channels = await channelsService.channels();

		for (const channel of channels) {
			logChannel(channel);
		}

		for (const channel of channels) {
			const results = await generator.runChannel(channel);
			await writer.writeMany(channel.path, results);
			logger.success(
				`Generated ${cHigh(
					`${results.length} files`
				)} for channel ${cChannel(channel.name)}`
			);
		}
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
