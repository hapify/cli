import { IWebSocketHandler, IWebSocketMessage } from '../../interface';
import { PresetsService } from '../Presets';
import * as Joi from 'joi';
export declare class GetPresetsHandlerService implements IWebSocketHandler {
    private presetsService;
    /**
     * Constructor
     * @param presetsService
     */
    constructor(presetsService: PresetsService);
    /** @inheritDoc */
    canHandle(message: IWebSocketMessage): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: IWebSocketMessage): Promise<any>;
}
