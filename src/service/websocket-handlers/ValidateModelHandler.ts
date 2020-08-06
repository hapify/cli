import { Service } from 'typedi';
import { ValidatorService } from '../Validator';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
import { ModelSchema } from '../../interface/schema/Model';

@Service()
export class ValidateModelHandlerService implements IWebSocketHandler {
	constructor(private validatorService: ValidatorService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'val:model';
	}

	validator(): Joi.Schema {
		return Joi.object({
			model: ModelSchema,
			content: Joi.string().required(),
		});
	}

	async handle(message: WebSocket): Promise<any> {
		// From content
		return await this.validatorService.run(message.data.content, message.data.model);
	}
}
