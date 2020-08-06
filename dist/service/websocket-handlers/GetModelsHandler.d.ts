import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GetModelsHandlerService implements IWebSocketHandler {
    private channelsService;
    /**
     * Constructor
     * @param channelsService
     */
    constructor(channelsService: ChannelsService);
    /** @inheritDoc */
    canHandle(message: WebSocket): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: WebSocket): Promise<any>;
}
