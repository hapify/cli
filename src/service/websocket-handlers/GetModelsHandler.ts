import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage, WebSocketMessages } from '../../interface/IWebSocketMessage';

@Service()
export class GetModelsHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param channelsService
	 */
	constructor(private channelsService: ChannelsService) {}

	/** @inheritDoc */
	canHandle(message: IWebSocketMessage): boolean {
		return message.id === WebSocketMessages.GET_MODELS;
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.any();
	}

	/** @inheritDoc */
	async handle(message: IWebSocketMessage): Promise<any> {
		return (await this.channelsService.modelsCollection()).toObject();
	}
}
