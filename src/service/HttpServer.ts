import { Service } from 'typedi';
import * as Path from 'path';
import * as http from 'http';
import { OptionsService } from './Options';
import { WebSocketServerService } from './WebSocketServer';
const opn = require('opn');
const DetectPort = require('detect-port');

import { Server } from 'hapi';

@Service()
export class HttpServerService {

  /** @type {string} WebApp root */
  private rootPath: string = Path.join(Path.dirname(require.main.filename), '..', 'html');

  /** @type {number} Start port number */
  private _minPort: number = 4800;
  /** @return {number} Start port getter */
  get minPort(): number { return this._minPort; }

  /** @type {number} Maximum port number */
  private _maxPort: number = 4820;
  /** @return {number} Maximum port getter */
  get maxPort(): number { return this._maxPort; }

  /** @type {number} Current port number */
  private _port: number = this._minPort;
  /** @return {number} Current port getter */
  get port(): number { return this._port; }

  /** @type {http.Server} The server instance */
  private server: Server;
  /** @type {boolean} Denotes if the server is started */
  private serverStarted: boolean;

  /**
   * Constructor
   * @param {OptionsService} optionsService
   * @param {WebSocketServerService} webSocketServerService
   */
  constructor(private optionsService: OptionsService,
              private webSocketServerService: WebSocketServerService) {}
  /**
   * Starts the http server
   * Check if running before starting
   * @return {Promise<void>}
   */
  public async serve(): Promise<void> {
    if (this.started()) return;

    // Choose port
    this._port = this.optionsService.port() ?
    this.optionsService.port() : await this.findAvailablePort();

    this.server = new Server({
        port: this._port,
        routes: {
            files: {
              relativeTo: this.rootPath
          }
        }
    });

    await this.server.register(require('inert'));
    this.server.ext('onPreResponse', (request: any, h: any) => {

        const response = request.response;
        if (response.isBoom &&
            response.output.statusCode === 404) {
    
            return h.file('index.html').code(200);
        }
    
        return h.continue;
    });

    await this.server.start();
    this.serverStarted = true;
    console.log('Server running at:', this.server.info.uri);

    // Bind events
    this.server.listener.on('close', async () => {
      await this.webSocketServerService.stop();
    });

    await this.webSocketServerService.serve(this.server.listener);
  }
  /**
   * Stops the http server
   * Check if running before stop
   * @return {Promise<void>}
   */
  public async stop(): Promise<void> {
    if (!this.started()) return;
    this.serverStarted = false;
    // Stop self server
    await this.server.stop();
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
   * Open the browser for the current server
   * Do not open if not started
   * @return {void}
   */
  public open(): void {
    const url = this.url();
    if (url) {
        opn(url);
    }
  }
  /**
   * Get the URL of the current session
   * Returns null if not started
   * @return {string|null}
   */
  public url(): string|null {
    return this.started() ? `http://${this.optionsService.hostname()}:${this._port}` : null;
  }
  /**
   * Test ports and returns the first one available
   * @param {number} increment
   * @return {Promise<number>}
   */
  private async findAvailablePort(increment: number = 0): Promise<number> {
    if (this._port > this._maxPort) {
      throw new Error(`Reached maximum port number ${this._maxPort} to start HTTP server`);
    }
    const requiredPort = this._port + increment;
    const possiblePort = await DetectPort(requiredPort);
    return requiredPort !== possiblePort ?
      this.findAvailablePort(increment + 1) : requiredPort;
  }
}
