import { ValidatorService } from '../Validator';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class ValidateModelHandlerService implements IWebSocketHandler {
    private validatorService;
    constructor(validatorService: ValidatorService);
    canHandle(message: WebSocket): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocket): Promise<any>;
}
