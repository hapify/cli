import { ChannelsService } from '../Channels';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GetModelsHandlerService implements IWebSocketHandler {
    private channelsService;
    constructor(channelsService: ChannelsService);
    canHandle(message: WebSocket): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocket): Promise<any>;
}
