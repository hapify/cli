import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class GetModelsHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param channelsService
	 */
	constructor(private channelsService: ChannelsService) {}

	/** @inheritDoc */
	canHandle(message: WebSocket): boolean {
		return message.id === 'get:models';
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.any();
	}

	/** @inheritDoc */
	async handle(message: WebSocket): Promise<any> {
		return (await this.channelsService.modelsCollection()).toObject();
	}
}
