import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketGenerateChannelHandlerInput } from '../../interface/WebSocketHandlers';
export declare class GenerateChannelHandlerService implements IWebSocketHandler<WebSocketGenerateChannelHandlerInput, void> {
    private channelsService;
    private generatorService;
    private writerService;
    constructor(channelsService: ChannelsService, generatorService: GeneratorService, writerService: WriterService);
    canHandle(message: WebSocketMessage<WebSocketGenerateChannelHandlerInput>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<WebSocketGenerateChannelHandlerInput>): Promise<void>;
}
