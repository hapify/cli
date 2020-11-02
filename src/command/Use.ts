import { Container } from 'typedi';
import { Command } from 'commander';
import { cChannel, cHigh } from './helpers';
import { OptionsService } from '../service/Options';
import { LoggerService } from '../service/Logger';
import { ChannelsService } from '../service/Channels';
import { AskProject, ProjectQuery, SetupProject } from './question/Project';

export async function UseCommand(cmd: Command) {
	// Get services
	const options = Container.get(OptionsService);
	const logger = Container.get(LoggerService);
	const channelsService = Container.get(ChannelsService);

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
}
