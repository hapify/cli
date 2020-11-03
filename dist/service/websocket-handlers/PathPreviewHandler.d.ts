import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketPathPreviewHandlerInput } from '../../interface/WebSocketHandlers';
export declare class PathPreviewHandlerService implements IWebSocketHandler<WebSocketPathPreviewHandlerInput, string> {
    private channelsService;
    private generatorService;
    constructor(channelsService: ChannelsService, generatorService: GeneratorService);
    canHandle(message: WebSocketMessage<WebSocketPathPreviewHandlerInput>): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocketMessage<WebSocketPathPreviewHandlerInput>): Promise<string>;
}
