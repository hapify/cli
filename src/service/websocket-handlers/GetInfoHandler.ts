import { Service } from 'typedi';
import * as Joi from 'joi';
import { InfoService } from '../Info';
import { GeneratorService } from '../Generator';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class GetInfoHandlerService implements IWebSocketHandler {
	constructor(private infoService: InfoService, private generatorService: GeneratorService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'get:info';
	}

	validator(): Joi.Schema {
		return Joi.any();
	}

	async handle(message: WebSocket): Promise<any> {
		return {
			project: await this.infoService.project(),
			limits: await this.generatorService.limits(),
		};
	}
}
