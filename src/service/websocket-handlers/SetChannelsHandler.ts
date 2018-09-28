import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage, IChannel } from '../../interface';
import { ChannelsService } from '../';
import * as Joi from 'joi';

@Service()
export class SetChannelsHandlerService implements IWebSockerHandler {

  /**
   * Constructor
   * @param channelsService
   */
  constructor(private channelsService: ChannelsService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.SET_CHANNELS;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.array().items(Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      validator: Joi.string().required().allow(''),
      templates: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        path: Joi.string().required(),
        engine: Joi.string().required(),
        input: Joi.string().required(),
        content: Joi.string().required().allow('')
      })).required()
    })).min(1);
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    // Existing channels
    const channels = await this.channelsService.channels();
    // New contents
    const toSaves: IChannel[] = message.data;
    // For each new content, get the corresponding channel and save it
    for (const toSave of toSaves) {
      const channel = channels.find((c) => c.id === toSave.id);
      // Scream if not found
      if (!channel) {
        throw new Error(`Channel not found: ${toSave.name}`);
      }
      channel.fromObject(toSave);
      channel.save();
    }
  }
}
