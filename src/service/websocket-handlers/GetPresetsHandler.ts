import { Service } from 'typedi';
import { WebSocketMessages, IWebSocketHandler, IWebSocketMessage } from '../../interface';
import { PresetsService } from '../';
import * as Joi from 'joi';

@Service()
export class GetModelsHandlerService implements IWebSocketHandler {

  /**
   * Constructor
   * @param presetsService
   */
  constructor(private presetsService: PresetsService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.GET_PRESETS;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.any();
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    return (await this.presetsService.collection()).toObject();
  }
}
