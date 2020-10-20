import { Container } from 'typedi';
import { Command } from 'commander';
import { cMedium, cPath } from './helpers';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { ChannelDescriptionQuery, DescribeChannel } from './question/Channel';
import { Channel } from '../class/Channel';
import { Project } from '../class/Project';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);

export async function InitCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		const qChannelDescription: ChannelDescriptionQuery = {};

		// =================================
		// Describe channel
		await DescribeChannel(cmd, qChannelDescription);

		// =================================
		// Init channel to save
		const channel = await Channel.create(options.dir(), qChannelDescription.name, qChannelDescription.description, qChannelDescription.logo);

		// Todo get and save project name and description

		// =================================
		// Create project from channel and save
		await Project.createLocalForChannel(channel);
		await channel.save();

		logger.success(`Initialized a channel in ${cPath(options.dir())}.
Run ${cMedium('hpf use')} to connect a remote project (optional)`);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handleAndExit(error);
	}
}
