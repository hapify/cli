import { Service } from 'typedi';
import * as Path from 'path';
import * as Fs from 'fs';
import * as ws from 'ws';
import * as http from 'http';
import * as Jwt from 'jsonwebtoken';
import * as RandomString from 'randomstring';
import { AddressInfo } from 'ws';
import { URL } from 'url';
import { GetModelsHandlerService, LoggerService } from './';
import { IWebSockerHandler, IWebSocketMessage } from '../interface';
import { Container } from 'typedi';

interface TokenData {
  name: string;
}

@Service()
export class WebSocketServerService {

  /** @type {string} Websocket endpoint */
  private baseUri: string = '/websocket';
  /** @type {ws.Server} The server instance */
  private server: ws.Server;
  /** @type {boolean} Denotes if the server is started */
  private serverStarted: boolean;

  /** @type {string} The path to save the token */
  private wsInfoPath: string = Path.join(Path.dirname(require.main.filename), '..', 'html', 'ws.json');
  /** @type {string} Random name to generate token */
  private randomName: string = RandomString.generate({length: 24});
  /** @type {string} Random secret to generate token */
  private randomSecret: string = RandomString.generate({length: 48});
  /** @type {string} Random secret to generate token */
  private tokenExpires: number = 24 * 60 * 60 * 1000; // 1 day;
  /** @type {IWebSockerHandler[]} Messages handlers */
  private handlers: IWebSockerHandler[] = [];

  /**
   * Constructor
   * @param {LoggerService} loggerService
   */
  constructor(private loggerService: LoggerService) {
    this.addHandler(Container.get(GetModelsHandlerService));
  }

  /**
   * Starts the http server
   * Check if running before starting
   * Every connection is checked against a JWT
   * @param {"http".Server} httpServer
   * @return {Promise<void>}
   */
  public async serve(httpServer: http.Server): Promise<void> {
    if (this.started()) return;
    // Choose port
    const options: ws.ServerOptions = {
      server: httpServer,
      path: this.baseUri,
      verifyClient: (info, cb) => {
        try {
          // Use fake hostname to parse url parameters
          const url = new URL(`http://localhost${info.req.url}`);
          const token = url.searchParams.get('token');
          if (!token) {
            cb(false, 401, 'Unauthorized');
          }
          else {
            Jwt.verify(token, this.randomSecret, (error: Error, decoded: TokenData) => {
              if (error || decoded.name !== this.randomName) {
                cb(false, 401, 'Unauthorized');
              }
              else {
                cb(true);
              }
            });
          }
        }
        catch (error) {
          this.loggerService.error(error.message);
          cb(false, 500, 'InternalError');
        }
      }
    };
    this.server = new ws.Server(options);

    this.server.on('connection', (ws: any) => {

      const id = this.makeId();
      this.loggerService.debug(`[WS:${id}] Did open new websocket connection`);

      ws.on('message', async (message: string) => {

        try {

          const decoded = <IWebSocketMessage>JSON.parse(message);
          // Log for debug
          this.loggerService.debug(`[WS:${id}] Did receive websocket message: ${decoded.id}`);
          // Dispatch message to the right handler
          let handled = false;
          for (const handler of this.handlers) {
            if (handler.canHandle(decoded)) {
              // Return the result to the client
              ws.send(JSON.stringify({
                id: decoded.id,
                tag: decoded.tag,
                data: await handler.handle(decoded)
              }));
              handled = true;
              break;
            }
          }
          // If message is not handled, send an error to the client
          if (!handled) {
            // Send the error to the client
            ws.send(JSON.stringify({
              id: decoded.id,
              tag: decoded.tag,
              type: 'error',
              data: {error: 'Unknown message key'}
            }));
          }

        } catch (error) {
          this.loggerService.debug(`[WS:${id}] Error while parsing message`);
          this.loggerService.error(error.message);
        }

      });

      ws.on('close', () => {
        this.loggerService.debug(`[WS:${id}] Did close websocket connection`);
      });
    });

    this.server.on('error', (error: Error) => {
      this.loggerService.error(error.message);
    });

    this.serverStarted = true;
    await this.createToken();
  }

  /**
   * Stops the http server
   * Check if running before stop
   * @return {Promise<void>}
   */
  public async stop(): Promise<void> {
    if (!this.started()) return;
    this.serverStarted = false;
    await new Promise((resolve, reject) => {
      this.server.close((error: Error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    await this.deleteToken();
    this.server = null;
  }

  /**
   * Denotes if the HTTP server is running
   * @return {boolean}
   */
  public started(): boolean {
    return this.server && this.serverStarted;
  }

  /**
   * Add a new handler
   * @param {IWebSockerHandler} handler
   */
  public addHandler(handler: IWebSockerHandler) {
    this.handlers.push(handler);
  }

  /**
   * Create and store token
   * @return {Promise<void>}
   */
  private async createToken(): Promise<void> {
    const wsAddress = <AddressInfo>this.server.address();
    const token = Jwt.sign({name: this.randomName}, this.randomSecret, {expiresIn: this.tokenExpires});
    const data = JSON.stringify({
      url: `ws://${wsAddress.address}:${wsAddress.port}${this.baseUri}?token=${encodeURIComponent(token)}`
    }, null, 2);
    Fs.writeFileSync(this.wsInfoPath, data, 'utf8');
  }

  /**
   * Remove the token
   * @return {Promise<void>}
   */
  private async deleteToken(): Promise<void> {
    if (Fs.existsSync(this.wsInfoPath)) {
      Fs.unlinkSync(this.wsInfoPath);
    }
  }

  /**
   * Create a unique id
   * @return {string}
   */
  private makeId(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
