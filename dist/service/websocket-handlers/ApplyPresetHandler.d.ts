import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { WebSocket } from '../../interface/WebSocket';
interface IWebSocketHandler {
}
export declare class ApplyPresetHandlerService implements IWebSocketHandler {
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
export {};
