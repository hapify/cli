export interface IWebSocketMessage {
  id: string;
  type?: string;
  tag?: string;
  data: any;
}

export class WebSocketMessages {
  static GET_MODELS = 'get:models';
  static GET_CHANNELS = 'get:channels';
}
