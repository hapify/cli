import { Service } from 'typedi';
import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class GetPresetsHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param presetsService
	 */
	constructor(private presetsService: PresetsService) {}

	/** @inheritDoc */
	canHandle(message: WebSocket): boolean {
		return message.id === 'get:presets';
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.any();
	}

	/** @inheritDoc */
	async handle(message: WebSocket): Promise<any> {
		return (await this.presetsService.collection()).toObject();
	}
}
