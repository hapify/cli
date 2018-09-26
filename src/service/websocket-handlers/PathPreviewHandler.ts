import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService, GeneratorService } from '../';

@Service()
export class PathPreviewHandlerService implements IWebSockerHandler {

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
    return message.id === WebSocketMessages.PREVIEW_PATH;
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    // Get model, if any
    const model = message.data.model ?
      (await (await this.channelsService.modelsCollection()).find(message.data.model)) :
      null;
    // Compute the path
    return this.generatorService.pathPreview(message.data.path, model);
  }
}
