import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService, ChannelsService } from '../service';
import { cChannel, cHigh } from './helpers';
import { ProjectQuery, AskProject, SetupProject } from './question';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const channelsService = Container.get(ChannelsService);

export async function UseCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		const qProject: ProjectQuery = {};

		// =================================
		// Get project
		await AskProject(cmd, qProject);

		// =================================
		// Create project if necessary
		await SetupProject(qProject);

		// =================================
		// Set project in channel and save
		await channelsService.changeProject(qProject.id);

		// =================================
		// Log changes
		const channels = await channelsService.channels();
		for (const channel of channels) {
			logger.success(`Did set project ${cHigh(qProject.id)} for channel ${cChannel(channel.name)}`);
		}
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
