import { Channel } from '../class';
import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService, ChannelsService } from '../service';
import { cPath } from './helpers';
import { ProjectQuery, AskProject, SetupProject } from './question';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const channelsService = Container.get(ChannelsService);

export async function InitCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		const qProject: ProjectQuery = {};

		// =================================
		// Init channel to save
		const channel = await Channel.create(options.dir());

		// =================================
		// Get project
		await AskProject(cmd, qProject);

		// =================================
		// Create project if necessary
		await SetupProject(qProject);

		// =================================
		// Set project in channel and save
		await channel.save();
		await channelsService.changeProject(qProject.id, channel.path);

		logger.success(
			`Initialized a dynamic boilerplate in ${cPath(options.dir())}`
		);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
