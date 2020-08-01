import * as Joi from 'joi';
import { InfoService } from '../Info';
import { GeneratorService } from '../Generator';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage } from '../../interface/IWebSocketMessage';
export declare class GetInfoHandlerService implements IWebSocketHandler {
    private infoService;
    private generatorService;
    /** Constructor */
    constructor(infoService: InfoService, generatorService: GeneratorService);
    /** @inheritDoc */
    canHandle(message: IWebSocketMessage): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: IWebSocketMessage): Promise<any>;
}
