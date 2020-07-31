import { IWebSocketHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import * as Joi from 'joi';
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
    canHandle(message: IWebSocketMessage): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: IWebSocketMessage): Promise<any>;
}
