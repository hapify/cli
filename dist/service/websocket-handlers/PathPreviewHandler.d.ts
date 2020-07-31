import { IWebSocketHandler, IWebSocketMessage } from '../../interface';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import * as Joi from 'joi';
export declare class PathPreviewHandlerService implements IWebSocketHandler {
    private channelsService;
    private generatorService;
    /**
     * Constructor
     * @param channelsService
     * @param generatorService
     */
    constructor(channelsService: ChannelsService, generatorService: GeneratorService);
    /** @inheritDoc */
    canHandle(message: IWebSocketMessage): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: IWebSocketMessage): Promise<any>;
}
