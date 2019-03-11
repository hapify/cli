import { Service } from 'typedi';
import {
	WebSocketMessages,
	IWebSocketHandler,
	IWebSocketMessage,
	IChannel,
	ChannelSchema
} from '../../interface';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';

@Service()
export class SetChannelsHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param channelsService
	 */
	constructor(private channelsService: ChannelsService) {}

	/** @inheritDoc */
	canHandle(message: IWebSocketMessage): boolean {
		return message.id === WebSocketMessages.SET_CHANNELS;
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.array()
			.items(ChannelSchema)
			.min(0);
	}

	/** @inheritDoc */
	async handle(message: IWebSocketMessage): Promise<any> {
		// Existing channels
		const channels = await this.channelsService.channels();
		// New contents
		const toSaves: IChannel[] = message.data;
		// For each new content, get the corresponding channel and save it
		for (const toSave of toSaves) {
			const channel = channels.find(c => c.id === toSave.id);
			// Scream if not found
			if (!channel) {
				throw new Error(`Channel not found: ${toSave.name}`);
			}
			channel.fromObject(toSave);
			await channel.save();
		}
	}
}
