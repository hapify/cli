import { Service } from 'typedi';
import {
	WebSocketMessages,
	IWebSocketHandler,
	IWebSocketMessage
} from '../../interface';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import * as Joi from 'joi';

@Service()
export class GenerateChannelHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param {ChannelsService} channelsService
	 * @param {GeneratorService} generatorService
	 * @param {WriterService} writerService
	 */
	constructor(
		private channelsService: ChannelsService,
		private generatorService: GeneratorService,
		private writerService: WriterService
	) {}

	/** @inheritDoc */
	canHandle(message: IWebSocketMessage): boolean {
		return message.id === WebSocketMessages.GENERATE_CHANNEL;
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.object({
			channel: Joi.string().required()
		});
	}

	/** @inheritDoc */
	async handle(message: IWebSocketMessage): Promise<any> {
		// Get channel
		const channel = (await this.channelsService.channels()).find(
			c => c.id === message.data.channel
		);
		if (!channel) {
			throw new Error(`Unable to find channel ${message.data.channel}`);
		}
		const results = await this.generatorService.runChannel(channel);
		await this.writerService.writeMany(channel.path, results);
	}
}
