import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import * as Joi from 'joi';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage } from '../../interface/IWebSocketMessage';
export declare class GenerateTemplateHandlerService implements IWebSocketHandler {
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
