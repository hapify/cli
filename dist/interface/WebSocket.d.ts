import Joi from 'joi';
export declare type WebSocketMessageId = 'error' | 'get:models' | 'set:models' | 'new:model' | 'get:channels' | 'set:channels' | 'get:presets' | 'apply:presets' | 'get:info' | 'prv:path' | 'prv:template' | 'val:model' | 'gen:template' | 'gen:channel';
export interface WebSocketMessage<T> {
    id: WebSocketMessageId;
    type?: string;
    tag?: string;
    data: T;
}
export declare const WebSocketMessageSchema: Joi.ObjectSchema<any>;
export interface IWebSocketHandler<I, O> {
    /** Denotes if the handler can handle this message */
    canHandle(message: WebSocketMessage<I>): boolean;
    /**
     * Handle message.
     * Returns data if necessary, null otherwise
     */
    handle(message: WebSocketMessage<I>): Promise<O>;
    /** Returns the JOi validator for the input payload */
    validator(): Joi.Schema;
}
