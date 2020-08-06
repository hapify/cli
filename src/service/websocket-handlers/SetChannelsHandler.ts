import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
import { ChannelSchema } from '../../interface/schema/Channel';
import { IChannel } from '../../interface/Objects';

@Service()
export class SetChannelsHandlerService implements IWebSocketHandler {
	constructor(private channelsService: ChannelsService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'set:channels';
	}

	validator(): Joi.Schema {
		return Joi.array().items(ChannelSchema).min(0);
	}

	async handle(message: WebSocket): Promise<any> {
		// Existing channels
		const channels = await this.channelsService.channels();
		// New contents
		const toSaves: IChannel[] = message.data;
		// For each new content, get the corresponding channel and save it
		for (const toSave of toSaves) {
			const channel = channels.find((c) => c.id === toSave.id);
			// Scream if not found
			if (!channel) {
				throw new Error(`Channel not found: ${toSave.name}`);
			}
			channel.fromObject(toSave);
			await channel.save();
		}
	}
}
