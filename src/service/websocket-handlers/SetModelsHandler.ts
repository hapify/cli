import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
import { ModelSchema } from '../../interface/schema/Model';

@Service()
export class SetModelsHandlerService implements IWebSocketHandler {
	constructor(private channelsService: ChannelsService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'set:models';
	}

	validator(): Joi.Schema {
		return Joi.array().items(ModelSchema).min(0);
	}

	async handle(message: WebSocket): Promise<any> {
		const modelsCollection = await this.channelsService.modelsCollection();
		modelsCollection.fromObject(message.data);
		await modelsCollection.save();
	}
}
