import * as Joi from 'joi';
export interface IWebSocketMessage {
    id: string;
    type?: string;
    tag?: string;
    data: any;
}
export declare const WebSocketMessageSchema: Joi.ObjectSchema;
export declare class WebSocketMessages {
    static GET_MODELS: string;
    static SET_MODELS: string;
    static NEW_MODEL: string;
    static GET_CHANNELS: string;
    static SET_CHANNELS: string;
    static GET_PRESETS: string;
    static APPLY_PRESETS: string;
    static GET_INFO: string;
    static PREVIEW_PATH: string;
    static PREVIEW_TEMPLATE: string;
    static VALIDATE_MODEL: string;
    static GENERATE_TEMPLATE: string;
    static GENERATE_CHANNEL: string;
}
