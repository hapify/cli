import { Service } from 'typedi';
import { WebSocketMessages, IWebSocketHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../';
import * as Joi from 'joi';
import { Access } from '../../interface/IObjects';

@Service()
export class SetModelsHandlerService implements IWebSocketHandler {

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
    const accesses = [Access.ADMIN, Access.OWNER, Access.AUTHENTICATED, Access.GUEST];
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
        important: Joi.boolean().required(),
        searchable: Joi.boolean().required(),
        sortable: Joi.boolean().required(),
        isPrivate: Joi.boolean().required(),
        internal: Joi.boolean().required(),
        restricted: Joi.boolean().required(),
        ownership: Joi.boolean().required(),
      })).required().min(1),
      accesses: Joi.object({
        create: Joi.string().valid(accesses).required(),
        read: Joi.string().valid(accesses).required(),
        update: Joi.string().valid(accesses).required(),
        remove: Joi.string().valid(accesses).required(),
        search: Joi.string().valid(accesses).required(),
        count: Joi.string().valid(accesses).required(),
      })
    })).min(0);
  }

  /** @inheritDoc */
  async handle(message: IWebSocketMessage): Promise<any> {
    const modelsCollection = await this.channelsService.modelsCollection();
    modelsCollection.fromObject(message.data);
    await modelsCollection.save();
  }
}
