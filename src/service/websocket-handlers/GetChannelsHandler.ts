import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class GetChannelsHandlerService implements IWebSocketHandler {
	constructor(private channelsService: ChannelsService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'get:channels';
	}

	validator(): Joi.Schema {
		return Joi.any();
	}

	async handle(message: WebSocket): Promise<any> {
		const channels = await this.channelsService.channels();
		return await channels.map((channel) => channel.toObject());
	}
}
