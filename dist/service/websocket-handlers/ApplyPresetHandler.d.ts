import { PresetsService } from '../Presets';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketApplyPresetHandlerInput, WebSocketApplyPresetHandlerOutput } from '../../interface/WebSocketHandlers';
export declare class ApplyPresetHandlerService implements IWebSocketHandler<WebSocketApplyPresetHandlerInput, WebSocketApplyPresetHandlerOutput> {
    private presetsService;
    constructor(presetsService: PresetsService);
    canHandle(message: WebSocketMessage<WebSocketApplyPresetHandlerInput>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<WebSocketApplyPresetHandlerInput>): Promise<WebSocketApplyPresetHandlerOutput>;
}
