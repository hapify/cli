import * as Joi from 'joi';
import { InfoService } from '../Info';
import { GeneratorService } from '../Generator';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GetInfoHandlerService implements IWebSocketHandler {
    private infoService;
    private generatorService;
    /** Constructor */
    constructor(infoService: InfoService, generatorService: GeneratorService);
    /** @inheritDoc */
    canHandle(message: WebSocket): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: WebSocket): Promise<any>;
}
