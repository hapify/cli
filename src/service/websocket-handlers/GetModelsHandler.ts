import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../';
import * as Joi from 'joi';

@Service()
export class GetModelsHandlerService implements IWebSockerHandler {

  /**
   * Constructor
   * @param channelsService
   */
  constructor(private channelsService: ChannelsService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.GET_MODELS;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.any();
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    return (await this.channelsService.modelsCollection()).toObject();
  }
}
