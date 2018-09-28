import { Service } from 'typedi';
import { WebSocketMessages, IWebSockerHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../';
import * as Joi from 'joi';

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
  validator(): Joi.Schema {
    return Joi.array().items(Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      fields: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
        subtype: Joi.string().required().allow(null),
        reference: Joi.string().required().allow(null),
        primary: Joi.boolean().required(),
        unique: Joi.boolean().required(),
        label: Joi.boolean().required(),
        nullable: Joi.boolean().required(),
        multiple: Joi.boolean().required(),
        searchable: Joi.boolean().required(),
        sortable: Joi.boolean().required(),
        isPrivate: Joi.boolean().required(),
        internal: Joi.boolean().required(),
        important: Joi.boolean().required(),
      })).required().min(1)
    })).min(1);
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    const modelsCollection = await this.channelsService.modelsCollection();
    modelsCollection.fromObject(message.data);
    modelsCollection.save();
  }
}
