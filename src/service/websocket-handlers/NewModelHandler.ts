import { Service } from 'typedi';
import * as Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
import { Model } from '../../class/Model';
import { IModel } from '../../interface/Generator';

@Service()
export class NewModelHandlerService implements IWebSocketHandler {
	constructor(private infoService: InfoService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'new:model';
	}

	validator(): Joi.Schema {
		return Joi.object({
			name: Joi.string().required(),
		});
	}

	async handle(message: WebSocket): Promise<IModel> {
		return new Model({
			id: Model.generateTempId(),
			name: message.data.name as string,
			fields: await this.infoService.fields(),
			accesses: Model.defaultAccesses(),
		}).toObject();
	}
}
