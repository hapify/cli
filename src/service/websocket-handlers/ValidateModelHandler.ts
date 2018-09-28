import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService, ValidatorService } from '../';
import * as Joi from 'joi';

@Service()
export class ValidateModelHandlerService implements IWebSockerHandler {

  /**
   * Constructor
   * @param channelsService
   * @param validatorService
   */
  constructor (private channelsService: ChannelsService,
               private validatorService: ValidatorService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.VALIDATE_MODEL;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.object({
      model: Joi.string().required(),
      channel: Joi.string(),
      content: Joi.string()
    }).xor('channel', 'content');
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {

    // Get model
    const model = await (await this.channelsService.modelsCollection()).find(message.data.model);
    if (!model) {
      throw new Error(`Unable to find model ${message.data.model}`);
    }

    // From an existing channel
    if (message.data.channel) {
      // Get channel
      const channel = (await this.channelsService.channels()).find((c) => c.id === message.data.channel);
      if (!channel) {
        throw new Error(`Unable to find channel ${message.data.channel}`);
      }
      return await this.validatorService.runForChannel(channel, model);
    }

    // From content
    return await this.validatorService.run(message.data.content, model);
  }
}
