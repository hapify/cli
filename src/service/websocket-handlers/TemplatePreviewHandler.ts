import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage, ITemplate } from '../../interface';
import { ChannelsService, GeneratorService } from '../';
import { Template } from '../../class';
import * as Joi from 'joi';

@Service()
export class TemplatePreviewHandlerService implements IWebSockerHandler {

  /**
   * Constructor
   * @param channelsService
   * @param generatorService
   */
  constructor (private channelsService: ChannelsService,
               private generatorService: GeneratorService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.PREVIEW_TEMPLATE;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.object({
      model: Joi.string(),
      channel: Joi.string().required(),
      template: Joi.object({
        name: Joi.string().required(),
        path: Joi.string().required(),
        engine: Joi.string().required(),
        input: Joi.string().required(),
        content: Joi.string().required().allow('')
      }).required()
    });
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    // Get channel
    const channel = (await this.channelsService.channels()).find((c) => c.id === message.data.channel);
    // Get model, if any
    const model = message.data.model ? (await channel.modelsCollection.find(message.data.model)) : null;
    // Get template
    const templateData: ITemplate = message.data.template;
    const template = new Template(channel);
    template.fromObject(templateData);
    // Compute the path
    return this.generatorService.run(template, model);
  }
}
