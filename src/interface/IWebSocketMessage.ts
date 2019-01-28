import * as Joi from 'joi';

export interface IWebSocketMessage {
	id: string;
	type?: string;
	tag?: string;
	data: any;
}

export const WebSocketMessageSchema = Joi.object({
	id: Joi.string().required(),
	type: Joi.string().valid(['error', 'success']),
	tag: Joi.string(),
	data: Joi.any()
});

export class WebSocketMessages {
	static GET_MODELS = 'get:models';
	static SET_MODELS = 'set:models';
	static GET_CHANNELS = 'get:channels';
	static SET_CHANNELS = 'set:channels';
	static GET_PRESETS = 'get:presets';
	static GET_INFO = 'get:info';
	static PREVIEW_PATH = 'prv:path';
	static PREVIEW_TEMPLATE = 'prv:template';
	static VALIDATE_MODEL = 'val:model';
	static GENERATE_TEMPLATE = 'gen:template';
	static GENERATE_CHANNEL = 'gen:channel';
}
