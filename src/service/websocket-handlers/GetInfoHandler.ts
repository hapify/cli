import { Service } from 'typedi';
import { WebSocketMessages, IWebSocketHandler, IWebSocketMessage } from '../../interface';
import * as Joi from 'joi';
import { InfoService } from '../Info';

@Service()
export class GetInfoHandlerService implements IWebSocketHandler {

  /** Constructor */
  constructor(private infoService: InfoService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.GET_INFO;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.any();
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    return {
      project: await this.infoService.project(),
      limits: await this.infoService.limits()
    };
  }
}
