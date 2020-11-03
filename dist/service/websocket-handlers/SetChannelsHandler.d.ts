import { ChannelsService } from '../Channels';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { IChannel } from '../../interface/Objects';
export declare class SetChannelsHandlerService implements IWebSocketHandler<IChannel[], void> {
    private channelsService;
    constructor(channelsService: ChannelsService);
    canHandle(message: WebSocketMessage<IChannel[]>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<IChannel[]>): Promise<void>;
}
