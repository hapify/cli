import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService, GeneratorService } from '../';
import * as Joi from 'joi';

@Service()
export class GenerateTemplateHandlerService implements IWebSockerHandler {

  /**
   * Constructor
   * @param {ChannelsService} channelsService
   * @param {GeneratorService} generatorService
   */
  constructor(private channelsService: ChannelsService,
              private generatorService: GeneratorService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.GENERATE_TEMPLATE;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.object({
      channel: Joi.string().required(),
      template: Joi.string().required(),
    });
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    // Get channel
    const channel = (await this.channelsService.channels()).find((c) => c.id === message.data.channel);
    if (!channel) {
      throw new Error(`Unable to find channel ${message.data.channel}`);
    }
    // Get template
    const template = channel.templates.find((t) => t.path === message.data.template);
    if (!template) {
      throw new Error(`Unable to find template ${message.data.template}`);
    }
    await this.generatorService.runTemplate(template);
  }
}
