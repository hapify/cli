import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GetPresetsHandlerService implements IWebSocketHandler {
    private presetsService;
    constructor(presetsService: PresetsService);
    canHandle(message: WebSocket): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocket): Promise<any>;
}
