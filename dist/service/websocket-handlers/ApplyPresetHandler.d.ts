import { PresetsService } from '../Presets';
import * as Joi from 'joi';
import { IWebSocketMessage } from '../../interface/IWebSocketMessage';
interface IWebSocketHandler {
}
export declare class ApplyPresetHandlerService implements IWebSocketHandler {
    private presetsService;
    /**
     * Constructor
     * @param presetsService
     */
    constructor(presetsService: PresetsService);
    /** @inheritDoc */
    canHandle(message: IWebSocketMessage): boolean;
    /** @inheritDoc */
    validator(): Joi.Schema;
    /** @inheritDoc */
    handle(message: IWebSocketMessage): Promise<any>;
}
export {};
