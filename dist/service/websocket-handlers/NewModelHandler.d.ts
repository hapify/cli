import Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { IModel } from '../../interface/Generator';
import { WebSocketNewModelHandlerInput } from '../../interface/WebSocketHandlers';
export declare class NewModelHandlerService implements IWebSocketHandler<WebSocketNewModelHandlerInput, IModel> {
    private infoService;
    constructor(infoService: InfoService);
    canHandle(message: WebSocketMessage<WebSocketNewModelHandlerInput>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<WebSocketNewModelHandlerInput>): Promise<IModel>;
}
