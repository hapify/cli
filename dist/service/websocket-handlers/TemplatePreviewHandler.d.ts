import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketTemplatePreviewHandlerInput } from '../../interface/WebSocketHandlers';
import { IGeneratorResult } from '../../interface/Generator';
export declare class TemplatePreviewHandlerService implements IWebSocketHandler<WebSocketTemplatePreviewHandlerInput, IGeneratorResult> {
    private channelsService;
    private generatorService;
    constructor(channelsService: ChannelsService, generatorService: GeneratorService);
    canHandle(message: WebSocketMessage<WebSocketTemplatePreviewHandlerInput>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<WebSocketTemplatePreviewHandlerInput>): Promise<IGeneratorResult>;
}
