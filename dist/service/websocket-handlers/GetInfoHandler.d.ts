import * as Joi from 'joi';
import { InfoService } from '../Info';
import { GeneratorService } from '../Generator';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GetInfoHandlerService implements IWebSocketHandler {
    private infoService;
    private generatorService;
    constructor(infoService: InfoService, generatorService: GeneratorService);
    canHandle(message: WebSocket): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocket): Promise<any>;
}
