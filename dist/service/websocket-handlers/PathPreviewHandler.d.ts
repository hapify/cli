import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import * as Joi from 'joi';
import { IWebSocketHandler } from '../../interface/IWebSocketHandler';
import { IWebSocketMessage } from '../../interface/IWebSocketMessage';
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
