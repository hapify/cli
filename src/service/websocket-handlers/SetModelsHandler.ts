import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage, WebSocketMessages } from '../../interface/IWebSocketMessage';
import { ModelSchema } from '../../interface/schema/Model';

@Service()
export class SetModelsHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param channelsService
	 */
	constructor(private channelsService: ChannelsService) {}

	/** @inheritDoc */
	canHandle(message: IWebSocketMessage): boolean {
		return message.id === WebSocketMessages.SET_MODELS;
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.array().items(ModelSchema).min(0);
	}

	/** @inheritDoc */
	async handle(message: IWebSocketMessage): Promise<any> {
		const modelsCollection = await this.channelsService.modelsCollection();
		modelsCollection.fromObject(message.data);
		await modelsCollection.save();
	}
}
