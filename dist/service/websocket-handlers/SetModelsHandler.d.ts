import { IWebSocketHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
export declare class SetModelsHandlerService implements IWebSocketHandler {
    private channelsService;
    /**
     * Constructor
     * @param channelsService
     */
    constructor(channelsService: ChannelsService);
    /** @inheritDoc */
    canHandle(message: IWebSocketMessage): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: IWebSocketMessage): Promise<any>;
}
