import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage } from '../../interface/IWebSocketMessage';
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
