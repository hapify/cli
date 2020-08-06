import { Service } from 'typedi';
import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class GetPresetsHandlerService implements IWebSocketHandler {
	constructor(private presetsService: PresetsService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'get:presets';
	}

	validator(): Joi.Schema {
		return Joi.any();
	}

	async handle(message: WebSocket): Promise<any> {
		return (await this.presetsService.collection()).toObject();
	}
}
