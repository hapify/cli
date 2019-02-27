import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService, ChannelsService } from '../service';
import { cChannel, cHigh, cPath, logChannel } from './helpers';
import { ProjectQuery, AskProject } from './question';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const channelsService = Container.get(ChannelsService);

export async function UseCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		const qProject: ProjectQuery = {};

		// =================================
		// Init channel to change
		const channels = await channelsService.channels();

		for (const channel of channels) {
			logChannel(channel);
		}

		// =================================
		// Get project
		await AskProject(cmd, qProject);

		// =================================
		// Set project in channel and save
		for (const channel of channels) {
			channel.config.project = qProject.id;
			await channel.save();
			logger.success(
				`Did set project ${cHigh(qProject.id)} for channel ${cChannel(
					channel.name
				)}`
			);
		}
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
