import { Channel } from '../class';
import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService, ChannelsService } from '../service';
import { logChannel, cChannel, cModel, cPath } from './helpers';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const channelsService = Container.get(ChannelsService);

export async function ListCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		const channels = await channelsService.channels();

		for (const channel of channels) {
			logChannel(channel);
		}

		// Group channels by models collections
		const modelsCollections: { [s: string]: Channel[] } = {};
		for (const channel of channels) {
			if (
				typeof modelsCollections[channel.modelsCollection.path] ===
				'undefined'
			) {
				modelsCollections[channel.modelsCollection.path] = [];
			}
			modelsCollections[channel.modelsCollection.path].push(channel);
		}

		const modelsPaths = Object.keys(modelsCollections);
		for (const modelsPath of modelsPaths) {
			const c: Channel[] = modelsCollections[modelsPath];
			const mc = c.length > 1;
			const m = await c[0].modelsCollection.list();
			const mm = m.length > 1;
			let message = `Channel${mc ? 's' : ''} ${c
				.map(c => cChannel(c.name))
				.join(', ')} use${mc ? '' : 's'} model${
				mm ? 's' : ''
			} of ${cPath(modelsPath)}`;
			if (m.length === 0) {
				message += `\nThere is no model yet.`;
			} else {
				message += `\nThe model${mm ? 's are' : ' is'}:\n- ${m
					.map(m => cModel(m.name))
					.join('\n- ')}`;
			}
			logger.newLine().info(message);
		}
		logger.newLine();

		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
