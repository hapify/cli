import * as Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GetInfoHandlerService implements IWebSocketHandler {
    private infoService;
    constructor(infoService: InfoService);
    canHandle(message: WebSocket): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocket): Promise<any>;
}
