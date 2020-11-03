import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketGenerateTemplateHandlerInput } from '../../interface/WebSocketHandlers';
export declare class GenerateTemplateHandlerService implements IWebSocketHandler<WebSocketGenerateTemplateHandlerInput, void> {
    private channelsService;
    private generatorService;
    private writerService;
    constructor(channelsService: ChannelsService, generatorService: GeneratorService, writerService: WriterService);
    canHandle(message: WebSocketMessage<WebSocketGenerateTemplateHandlerInput>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<WebSocketGenerateTemplateHandlerInput>): Promise<void>;
}
