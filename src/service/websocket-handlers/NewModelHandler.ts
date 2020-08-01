import { Service } from 'typedi';
import * as Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage, WebSocketMessages } from '../../interface/IWebSocketMessage';
import { Model } from '../../class/Model';
import { IModel } from '../../interface/IObjects';

@Service()
export class NewModelHandlerService implements IWebSocketHandler {
	/** Constructor */
	constructor(private infoService: InfoService) {}

	/** @inheritDoc */
	canHandle(message: IWebSocketMessage): boolean {
		return message.id === WebSocketMessages.NEW_MODEL;
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.object({
			name: Joi.string().required(),
		});
	}

	/** @inheritDoc */
	async handle(message: IWebSocketMessage): Promise<IModel> {
		return new Model({
			id: Model.generateTempId(),
			name: message.data.name as string,
			fields: await this.infoService.fields(),
			accesses: Model.defaultAccesses(),
		}).toObject();
	}
}
