import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage, IModel } from '../../interface';
import { OptionsService } from '../';
import { Channel, Model } from '../../class';

@Service()
export class GetChannelsHandlerService implements IWebSockerHandler {

  /**
   * Constructor
   * @param optionsService
   */
  constructor(private optionsService: OptionsService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.GET_CHANNELS;
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    const channels = Channel.sniff(this.optionsService.dir(), this.optionsService.depth());
    for (const channel of channels) {
      await channel.load();
    }
    return await channels.map(channel => channel.toObject());
  }
}
