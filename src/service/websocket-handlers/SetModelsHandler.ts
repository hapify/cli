import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../';

@Service()
export class SetModelsHandlerService implements IWebSockerHandler {

  /**
   * Constructor
   * @param channelsService
   */
  constructor(private channelsService: ChannelsService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.SET_MODELS;
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    const modelsCollection = await this.channelsService.modelsCollection();
    modelsCollection.fromObject(message.data);
    modelsCollection.save();
  }
}
