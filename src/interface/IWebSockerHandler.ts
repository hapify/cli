import { IWebSocketMessage } from './IWebSocketMessage';

export interface IWebSockerHandler {

  /**
   * Denotes if the handler can handle this message
   * @param {IWebSocketMessage} message
   * @return {boolean}
   */
  canHandle(message: IWebSocketMessage): boolean;

  /**
   * Handle message.
   * Returns data if necessary, null otherwise
   * @param {IWebSocketMessage} message
   * @return {Promise<any|null>}
   */
  handle(message: IWebSocketMessage): Promise<any|null>;
}

