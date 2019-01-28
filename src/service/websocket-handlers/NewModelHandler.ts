import { Service } from 'typedi';
import {
	WebSocketMessages,
	IWebSocketHandler,
	IWebSocketMessage,
	IModel
} from '../../interface';
import { Model } from '../../class';
import * as Joi from 'joi';
import { InfoService } from '../Info';

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
			name: Joi.string().required()
		});
	}

	/** @inheritDoc */
	async handle(message: IWebSocketMessage): Promise<IModel> {
		const model = new Model();
		model.fromObject({
			id: Model.generateTempId(),
			name: message.data.name as string,
			fields: await this.infoService.fields(),
			accesses: Model.defaultAccesses()
		});
		return model.toObject();
	}
}
