import Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketGetInfoHandlerOutput } from '../../interface/WebSocketHandlers';
export declare class GetInfoHandlerService implements IWebSocketHandler<{}, WebSocketGetInfoHandlerOutput> {
    private infoService;
    constructor(infoService: InfoService);
    canHandle(message: WebSocketMessage<{}>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<{}>): Promise<WebSocketGetInfoHandlerOutput>;
}
