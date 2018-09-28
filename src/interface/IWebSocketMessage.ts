export interface IWebSocketMessage {
  id: string;
  type?: string;
  tag?: string;
  data: any;
}

export class WebSocketMessages {
  static GET_MODELS = 'get:models';
  static SET_MODELS = 'set:models';
  static GET_CHANNELS = 'get:channels';
  static SET_CHANNELS = 'set:channels';
  static PREVIEW_PATH = 'prv:path';
  static PREVIEW_TEMPLATE = 'prv:template';
  static VALIDATE_MODEL = 'val:model';
}
