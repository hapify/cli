import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { WebSocket } from '../../interface/WebSocket';
interface IWebSocketHandler {
}
export declare class ApplyPresetHandlerService implements IWebSocketHandler {
    private presetsService;
    constructor(presetsService: PresetsService);
    canHandle(message: WebSocket): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocket): Promise<any>;
}
export {};
