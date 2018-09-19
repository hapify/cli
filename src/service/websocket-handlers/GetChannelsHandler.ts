import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../';

@Service()
export class GetChannelsHandlerService implements IWebSockerHandler {

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
  async handle(message: IWebSocketMessage): Promise<any> {
    const channels = await this.channelsService.channels();
    return await channels.map(channel => channel.toObject());
  }
}
