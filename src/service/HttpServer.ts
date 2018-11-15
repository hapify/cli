import { Service } from 'typedi';
import * as Path from 'path';
import * as http from 'http';
import HttpServer from 'http-server';
import { OptionsService } from './';
import { WebSocketServerService } from './WebSocketServer';
const { open } = require('openurl');
const DetectPort = require('detect-port');

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
  private server: http.Server;
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
    const options: HttpServer.Options = {
      root: this.rootPath,
      autoIndex: true,
      showDotfiles: false,
      showDir: false,
      cors: true,
      gzip: true
    };

    // Create server
    this.server = (<any>HttpServer.createServer(options)).server; // wrong typing in @types/http-server

    // Bind events
    this.server.on('close', async () => {
      await this.webSocketServerService.stop();
    });

    // Start listening
    this.serverStarted = await <Promise<boolean>>new Promise((resolve, reject) => {
      this.server.listen(this._port, this.optionsService.hostname(), (error: Error) => {
        if (error) reject(error);
        else resolve(true);
      });
    });
    await this.webSocketServerService.serve(this.server);
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
    await new Promise((resolve, reject) => {
      this.server.close((error: Error) => {
        if (error) reject(error);
        else resolve();
      });
    });
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
    if (url) { open(url); }
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
