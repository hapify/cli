import { Service } from 'typedi';
import { WebSocketMessages, IWebSocketHandler, IWebSocketMessage, TemplateSchema } from '../../interface';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { Template } from '../../class';
import * as Joi from 'joi';

@Service()
export class TemplatePreviewHandlerService implements IWebSocketHandler {
	/**
	 * Constructor
	 * @param channelsService
	 * @param generatorService
	 */
	constructor(private channelsService: ChannelsService, private generatorService: GeneratorService) {}

	/** @inheritDoc */
	canHandle(message: IWebSocketMessage): boolean {
		return message.id === WebSocketMessages.PREVIEW_TEMPLATE;
	}

	/** @inheritDoc */
	validator(): Joi.Schema {
		return Joi.object({
			model: Joi.string(),
			channel: Joi.string().required(),
			template: TemplateSchema.required(),
		});
	}

	/** @inheritDoc */
	async handle(message: IWebSocketMessage): Promise<any> {
		// Get channel
		const channel = (await this.channelsService.channels()).find((c) => c.id === message.data.channel);
		if (!channel) {
			throw new Error(`Unable to find channel ${message.data.channel}`);
		}
		// Get model, if any
		const model = message.data.model ? await channel.modelsCollection.find(message.data.model) : null;
		// Get template
		const template = new Template(channel, message.data.template);
		// Compute the path
		return this.generatorService.run(template, model);
	}
}
