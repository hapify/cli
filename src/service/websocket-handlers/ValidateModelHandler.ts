import { Service } from 'typedi';
import { WebSocketMessages, IWebSocketHandler, IWebSocketMessage, ModelSchema } from '../../interface';
import { ValidatorService } from '../Validator';
import * as Joi from 'joi';

@Service()
export class ValidateModelHandlerService implements IWebSocketHandler {

  /**
   * Constructor
   * @param validatorService
   */
  constructor(private validatorService: ValidatorService) {
  }

  /** @inheritDoc */
  canHandle(message: IWebSocketMessage): boolean {
    return message.id === WebSocketMessages.VALIDATE_MODEL;
  }

  /** @inheritDoc */
  validator(): Joi.Schema {
    return Joi.object({
      model: ModelSchema,
      content: Joi.string().required()
    });
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    // From content
    return await this.validatorService.run(message.data.content, message.data.model);
  }
}
