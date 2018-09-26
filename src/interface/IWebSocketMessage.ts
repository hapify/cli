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
  static GENERATE_PATH = 'gen:path';
}
