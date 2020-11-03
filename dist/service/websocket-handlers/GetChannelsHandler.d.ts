import { ChannelsService } from '../Channels';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { IChannel } from '../../interface/Objects';
export declare class GetChannelsHandlerService implements IWebSocketHandler<{}, IChannel[]> {
    private channelsService;
    constructor(channelsService: ChannelsService);
    canHandle(message: WebSocketMessage<{}>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<{}>): Promise<IChannel[]>;
}
