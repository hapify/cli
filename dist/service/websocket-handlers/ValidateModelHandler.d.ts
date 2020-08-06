import { ValidatorService } from '../Validator';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class ValidateModelHandlerService implements IWebSocketHandler {
    private validatorService;
    /**
     * Constructor
     * @param validatorService
     */
    constructor(validatorService: ValidatorService);
    /** @inheritDoc */
    canHandle(message: WebSocket): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: WebSocket): Promise<any>;
}
