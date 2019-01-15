import { Service } from 'typedi';
import * as Path from 'path';
import * as Fs from 'fs';
import * as ws from 'ws';
import * as http from 'http';
import * as Jwt from 'jsonwebtoken';
import * as RandomString from 'randomstring';
import { AddressInfo } from 'ws';
import { URL } from 'url';
import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import {
  GetModelsHandlerService, SetModelsHandlerService,
  GetChannelsHandlerService, SetChannelsHandlerService,
  GetPresetsHandlerService,
  PathPreviewHandlerService, TemplatePreviewHandlerService,
  ValidateModelHandlerService, GenerateTemplateHandlerService, GenerateChannelHandlerService
} from './websocket-handlers';
import { LoggerService } from './Logger';
import { IWebSocketHandler, IWebSocketMessage, WebSocketMessageSchema } from '../interface';
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
  /** @type {IWebSocketHandler[]} Messages handlers */
  private handlers: IWebSocketHandler[] = [];

  /**
   * Constructor
   * @param {LoggerService} loggerService
   */
  constructor(private loggerService: LoggerService) {
    this.addHandler(Container.get(GetModelsHandlerService));
    this.addHandler(Container.get(SetModelsHandlerService));
    this.addHandler(Container.get(GetChannelsHandlerService));
    this.addHandler(Container.get(SetChannelsHandlerService));
    this.addHandler(Container.get(GetPresetsHandlerService));
    this.addHandler(Container.get(PathPreviewHandlerService));
    this.addHandler(Container.get(TemplatePreviewHandlerService));
    // this.addHandler(Container.get(ValidateModelHandlerService));
    this.addHandler(Container.get(GenerateTemplateHandlerService));
    this.addHandler(Container.get(GenerateChannelHandlerService));
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
          } else {
            Jwt.verify(token, this.randomSecret, (error: Error, decoded: TokenData) => {
              if (error || decoded.name !== this.randomName) {
                cb(false, 401, 'Unauthorized');
              } else {
                cb(true);
              }
            });
          }
        } catch (error) {
          this.loggerService.error(error.message);
          cb(false, 500, 'InternalError');
        }
      }
    };
    this.server = new ws.Server(options);

    this.server.on('connection', (ws: any) => {

      // Create unique id for this connection
      const id = this.makeId();

      // Create a reply method for this connection
      const reply = (id: string, data: any, type?: string, tag?: string) => {
        const payload: IWebSocketMessage = {id, data};
        if (type) {
          payload.type = type;
        }
        if (tag) {
          payload.tag = tag;
        }
        ws.send(JSON.stringify(payload));
      };

      this.loggerService.debug(`[WS:${id}] Did open new websocket connection`);

      ws.on('message', async (message: string) => {

        let decoded: IWebSocketMessage;

        try {
          // Decode and verify message
          const parsed = Joi.validate(JSON.parse(message), WebSocketMessageSchema) as ValidationResult<IWebSocketMessage>;
          if (parsed.error) {
            throw parsed.error;
          }
          decoded = parsed.value;

          // Log for debug
          this.loggerService.debug(`[WS:${id}] Did receive websocket message: ${decoded.id}`);

          // Dispatch message to the right handler
          for (const handler of this.handlers) {
            if (handler.canHandle(decoded)) {

              // Validate the incoming payload
              const validation = Joi.validate(decoded.data, handler.validator());
              if (validation.error) {
                throw validation.error;
              }

              // Return the result to the client
              const data = await handler.handle(decoded);
              reply(decoded.id, data, 'success', decoded.tag);
              return;
            }
          }

          // If message is not handled, send an error to the client
          throw new Error(`Unknown message key ${decoded.id}`);

        } catch (error) {
          const dId = decoded && decoded.id ? decoded.id : 'error';
          const tag = decoded && decoded.tag ? decoded.tag : null;
          const payload: any = { message: error.message };
          if (error.data) { payload.data = error.data; }
          reply(dId, payload, 'error', tag);
          this.loggerService.debug(`[WS:${id}] Error while processing message`);
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

  /** Send a message to all websocket clients */
  public broadcast(data: any, type?: string): void {
    if (!this.started()) {
      this.loggerService.debug('Cannot broadcast message, server is not started');
    }
    for (const client of this.server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({id: 'broadcast', type, data}));
      }
    }
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
   * @param {IWebSocketHandler} handler
   */
  public addHandler(handler: IWebSocketHandler) {
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
