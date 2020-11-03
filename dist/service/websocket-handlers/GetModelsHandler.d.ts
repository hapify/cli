import { ChannelsService } from '../Channels';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { IModel } from '../../interface/Generator';
export declare class GetModelsHandlerService implements IWebSocketHandler<{}, IModel[]> {
    private channelsService;
    constructor(channelsService: ChannelsService);
    canHandle(message: WebSocketMessage<{}>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<{}>): Promise<IModel[]>;
}
