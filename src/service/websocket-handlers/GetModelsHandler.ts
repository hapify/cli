import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage, IModel } from '../../interface';
import { OptionsService } from '../';
import { Channel, Model } from '../../class';

@Service()
export class GetModelsHandlerService implements IWebSockerHandler {

  /**
   * Constructor
   * @param optionsService
   */
  constructor(private optionsService: OptionsService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.GET_MODELS;
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    const channels = Channel.sniff(this.optionsService.dir(), this.optionsService.depth());
    if (channels.length === 0) {
      return null;
    }
    await channels[0].load();
    return channels[0].modelsCollection.toObject();
  }
}
