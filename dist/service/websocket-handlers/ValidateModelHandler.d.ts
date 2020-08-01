import { ValidatorService } from '../Validator';
import * as Joi from 'joi';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage } from '../../interface/IWebSocketMessage';
export declare class ValidateModelHandlerService implements IWebSocketHandler {
    private validatorService;
    /**
     * Constructor
     * @param validatorService
     */
    constructor(validatorService: ValidatorService);
    /** @inheritDoc */
    canHandle(message: IWebSocketMessage): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: IWebSocketMessage): Promise<any>;
}
