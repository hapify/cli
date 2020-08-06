import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import * as Joi from 'joi';
import { IWebSocketHandler, WebSocket } from '../../interface/WebSocket';
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
    canHandle(message: WebSocket): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: WebSocket): Promise<any>;
}
