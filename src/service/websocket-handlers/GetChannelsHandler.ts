import { Service } from 'typedi';
import { WebSocketMessages, IWebSocketHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';

@Service()
export class GetChannelsHandlerService implements IWebSocketHandler {

  /**
   * Constructor
   * @param channelsService
   */
  constructor(private channelsService: ChannelsService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.GET_CHANNELS;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.any();
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    const channels = await this.channelsService.channels();
    return await channels.map(channel => channel.toObject());
  }
}
