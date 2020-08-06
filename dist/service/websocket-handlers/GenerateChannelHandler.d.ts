import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GenerateChannelHandlerService implements IWebSocketHandler {
    private channelsService;
    private generatorService;
    private writerService;
    constructor(channelsService: ChannelsService, generatorService: GeneratorService, writerService: WriterService);
    canHandle(message: WebSocket): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocket): Promise<any>;
}
