import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GetPresetsHandlerService implements IWebSocketHandler {
    private presetsService;
    /**
     * Constructor
     * @param presetsService
     */
    constructor(presetsService: PresetsService);
    /** @inheritDoc */
    canHandle(message: WebSocket): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: WebSocket): Promise<any>;
}
