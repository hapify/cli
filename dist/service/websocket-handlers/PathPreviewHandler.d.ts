import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class PathPreviewHandlerService implements IWebSocketHandler {
    private channelsService;
    private generatorService;
    constructor(channelsService: ChannelsService, generatorService: GeneratorService);
    canHandle(message: WebSocket): boolean;
    validator(): Joi.Schema;
    handle(message: WebSocket): Promise<any>;
}
