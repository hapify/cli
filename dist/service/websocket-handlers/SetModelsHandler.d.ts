import { ChannelsService } from '../Channels';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { IModel } from '../../interface/Generator';
export declare class SetModelsHandlerService implements IWebSocketHandler<IModel[], void> {
    private channelsService;
    constructor(channelsService: ChannelsService);
    canHandle(message: WebSocketMessage<IModel[]>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<IModel[]>): Promise<void>;
}
