import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';

@Service()
export class GenerateTemplateHandlerService implements IWebSocketHandler {
	constructor(private channelsService: ChannelsService, private generatorService: GeneratorService, private writerService: WriterService) {}

	canHandle(message: WebSocket): boolean {
		return message.id === 'gen:template';
	}

	validator(): Joi.Schema {
		return Joi.object({
			channel: Joi.string().required(),
			template: Joi.string().required(),
		});
	}

	async handle(message: WebSocket): Promise<any> {
		// Get channel
		const channel = (await this.channelsService.channels()).find((c) => c.id === message.data.channel);
		if (!channel) {
			throw new Error(`Unable to find channel ${message.data.channel}`);
		}
		// Get template
		const template = channel.templates.find((t: any) => t.path === message.data.template);
		if (!template) {
			throw new Error(`Unable to find template ${message.data.template}`);
		}
		const results = await this.generatorService.runTemplate(template);
		await this.writerService.writeMany(channel.path, results);
	}
}
