import { Service } from 'typedi';
import * as Joi from 'joi';
import { InfoService } from '../Info';
import { GeneratorService } from '../Generator';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class GetInfoHandlerService implements IWebSocketHandler {
	/** Constructor */
	constructor(private infoService: InfoService, private generatorService: GeneratorService) {}

	/** @inheritDoc */
	canHandle(message: WebSocket): boolean {
		return message.id === 'get:info';
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.any();
	}

	/** @inheritDoc */
	async handle(message: WebSocket): Promise<any> {
		return {
			project: await this.infoService.project(),
			limits: await this.generatorService.limits(),
		};
	}
}
