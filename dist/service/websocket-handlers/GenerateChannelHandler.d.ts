import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
export declare class GenerateChannelHandlerService implements IWebSocketHandler {
    private channelsService;
    private generatorService;
    private writerService;
    /**
     * Constructor
     * @param {ChannelsService} channelsService
     * @param {GeneratorService} generatorService
     * @param {WriterService} writerService
     */
    constructor(channelsService: ChannelsService, generatorService: GeneratorService, writerService: WriterService);
    /** @inheritDoc */
    canHandle(message: WebSocket): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: WebSocket): Promise<any>;
}
