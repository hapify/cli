import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class PathPreviewHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param channelsService
	 * @param generatorService
	 */
	constructor(private channelsService: ChannelsService, private generatorService: GeneratorService) {}

	/** @inheritDoc */
	canHandle(message: WebSocket): boolean {
		return message.id === 'prv:path';
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.object({
			model: Joi.string(),
			path: Joi.string().required(),
		});
	}

	/** @inheritDoc */
	async handle(message: WebSocket): Promise<any> {
		// Get model, if any
		const model = message.data.model ? await (await this.channelsService.modelsCollection()).find(message.data.model) : null;
		// Compute the path
		return await this.generatorService.pathPreview(message.data.path, model);
	}
}
