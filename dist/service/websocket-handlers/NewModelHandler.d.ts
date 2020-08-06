import * as Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
import { IModel } from '../../interface/Generator';
export declare class NewModelHandlerService implements IWebSocketHandler {
    private infoService;
    /** Constructor */
    constructor(infoService: InfoService);
    /** @inheritDoc */
    canHandle(message: WebSocket): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: WebSocket): Promise<IModel>;
}
