import { IWebSocketHandler, IWebSocketMessage, IModel } from '../../interface';
import * as Joi from 'joi';
import { InfoService } from '../Info';
export declare class NewModelHandlerService implements IWebSocketHandler {
    private infoService;
    /** Constructor */
    constructor(infoService: InfoService);
    /** @inheritDoc */
    canHandle(message: IWebSocketMessage): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: IWebSocketMessage): Promise<IModel>;
}
