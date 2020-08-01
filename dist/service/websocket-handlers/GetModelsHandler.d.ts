import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage } from '../../interface/IWebSocketMessage';
export declare class GetModelsHandlerService implements IWebSocketHandler {
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
