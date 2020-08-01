import * as Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage } from '../../interface/IWebSocketMessage';
import { IModel } from '../../interface/IObjects';
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
