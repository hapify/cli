import { ValidatorService } from '../Validator';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { Validator } from '../../interface/Validator';
import { WebSocketValidateModelHandlerInput } from '../../interface/WebSocketHandlers';
export declare class ValidateModelHandlerService implements IWebSocketHandler<WebSocketValidateModelHandlerInput, Validator> {
    private validatorService;
    constructor(validatorService: ValidatorService);
    canHandle(message: WebSocketMessage<WebSocketValidateModelHandlerInput>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<WebSocketValidateModelHandlerInput>): Promise<Validator>;
}
