import { Service } from 'typedi';
import {
	WebSocketMessages,
	IWebSocketHandler,
	IWebSocketMessage
} from '../../interface';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import * as Joi from 'joi';

@Service()
export class PathPreviewHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param channelsService
	 * @param generatorService
	 */
	constructor(
		private channelsService: ChannelsService,
		private generatorService: GeneratorService
	) {}

	/** @inheritDoc */
	canHandle(message: IWebSocketMessage): boolean {
		return message.id === WebSocketMessages.PREVIEW_PATH;
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.object({
			model: Joi.string(),
			path: Joi.string().required()
		});
	}

	/** @inheritDoc */
	async handle(message: IWebSocketMessage): Promise<any> {
		// Get model, if any
		const model = message.data.model
			? await (await this.channelsService.modelsCollection()).find(
					message.data.model
			  )
			: null;
		// Compute the path
		return await this.generatorService.pathPreview(
			message.data.path,
			model
		);
	}
}
