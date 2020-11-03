import { PresetsService } from '../Presets';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { IPreset } from '../../interface/Objects';
export declare class GetPresetsHandlerService implements IWebSocketHandler<{}, IPreset[]> {
    private presetsService;
    constructor(presetsService: PresetsService);
    canHandle(message: WebSocketMessage<{}>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<{}>): Promise<IPreset[]>;
}
