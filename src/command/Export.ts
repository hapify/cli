import * as Path from 'path';
import { Command } from 'commander';
import { Container } from 'typedi';
import { cChannel, cHigh, cPath, logChannel } from './helpers';
import { GeneratorService } from '../service/Generator';
import { OptionsService } from '../service/Options';
import { LoggerService } from '../service/Logger';
import { WriterService } from '../service/Writer';
import { Channel } from '../class/Channel';

// ############################################
// Get services
const generator = Container.get(GeneratorService);
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const writer = Container.get(WriterService);

export async function ExportCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		// ---------------------------------
		// Action starts
		const channel: Channel = new Channel(options.dir());
		await channel.load();
		logChannel(channel);

		const outputPath = options.output() || Path.join(options.dir(), `${channel.name}.zip`);

		const results = await generator.runChannel(channel);
		await writer.zip(outputPath, results);
		logger.success(`Generated and zipped ${cHigh(`${results.length} files`)} for channel ${cChannel(channel.name)} to ${cPath(outputPath)}`);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handleAndExit(error);
	}
}
