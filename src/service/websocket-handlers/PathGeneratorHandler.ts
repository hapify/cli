import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService, GeneratorService } from '../';
import { Template } from '../../class';

@Service()
export class PathGeneratorHandlerService implements IWebSockerHandler {

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
    return message.id === WebSocketMessages.GENERATE_PATH;
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {

    const template = (new Template())message.data.template;
    const model = message.data.model ?
      (await this.channelsService.modelsCollection()).find(message.data.model) :
      null;
    
    const channels = await ;
    return await channels.map(channel => channel.toObject());
  }
}
