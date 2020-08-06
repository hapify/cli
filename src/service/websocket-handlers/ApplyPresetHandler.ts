import { Service } from 'typedi';
import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { Model } from '../../class/Model';
import { WebSocket } from '../../interface/WebSocket';
import { ModelSchema } from '../../interface/schema/Model';
import { IModel } from '../../interface/Generator';

interface IWebSocketHandler {}

@Service()
export class ApplyPresetHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param presetsService
	 */
	constructor(private presetsService: PresetsService) {}

	/** @inheritDoc */
	canHandle(message: WebSocket): boolean {
		return message.id === 'apply:presets';
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.object({
			models: Joi.array().items(ModelSchema).required().min(0),
		});
	}

	/** @inheritDoc */
	async handle(message: WebSocket): Promise<any> {
		const models = message.data.models.map((m: IModel) => new Model(m));

		const results = await this.presetsService.apply(models);

		return {
			updated: results.updated.map((m) => m.toObject()),
			created: results.created.map((m) => m.toObject()),
		};
	}
}
