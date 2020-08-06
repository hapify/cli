import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class GetModelsHandlerService implements IWebSocketHandler {
	constructor(private channelsService: ChannelsService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'get:models';
	}

	validator(): Joi.Schema {
		return Joi.any();
	}

	async handle(message: WebSocket): Promise<any> {
		return (await this.channelsService.modelsCollection()).toObject();
	}
}
