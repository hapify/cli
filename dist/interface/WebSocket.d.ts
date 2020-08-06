import * as Joi from 'joi';
export declare type WebSocketMessage = 'error' | 'get:models' | 'set:models' | 'new:model' | 'get:channels' | 'set:channels' | 'get:presets' | 'apply:presets' | 'get:info' | 'prv:path' | 'prv:template' | 'val:model' | 'gen:template' | 'gen:channel';
export interface WebSocket {
    id: WebSocketMessage;
    type?: string;
    tag?: string;
    data: any;
}
export declare const WebSocketMessageSchema: Joi.ObjectSchema;
export interface IWebSocketHandler {
    /** Denotes if the handler can handle this message */
    canHandle(message: WebSocket): boolean;
    /**
     * Handle message.
     * Returns data if necessary, null otherwise
     */
    handle(message: WebSocket): Promise<any>;
    /** Returns the JOi validator for the input payload */
    validator(): Joi.Schema;
}
