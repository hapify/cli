import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
import { TemplateSchema } from '../../interface/schema/Template';
import { Template } from '../../class/Template';

@Service()
export class TemplatePreviewHandlerService implements IWebSocketHandler {
	constructor(private channelsService: ChannelsService, private generatorService: GeneratorService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'prv:template';
	}

	validator(): Joi.Schema {
		return Joi.object({
			model: Joi.string(),
			channel: Joi.string().required(),
			template: TemplateSchema.required(),
		});
	}

	async handle(message: WebSocket): Promise<any> {
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
