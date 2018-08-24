import { Service } from 'typedi';
import * as Path from 'path';
import * as http from 'http';
import * as util from 'util';
import HttpServer from 'http-server';
import { OptionsService } from './Options';
const getPort: any = require('get-port');

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

  /**
   * Constructor
   * @param {OptionsService} optionsService
   */
  constructor(private optionsService: OptionsService) {}
  /**
   * Starts the http server
   * @return {Promise<void>}
   */
  public async serve(): Promise<void> {
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
    this.server = <http.Server>HttpServer.createServer(options);
    this.server.listen(this._port, this.optionsService.hostname());
  }
  /**
   * Stops the http server
   * Check if running before stop
   * @return {Promise<void>}
   */
  public async stop(): Promise<void> {
    if (this.started()) {
      await util.promisify(this.server.close)();
    }
  }
  /**
   * Denotes if the HTTP server is running
   * @return {boolean}
   */
  public started(): boolean {
    return this.server && this.server.listening;
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
    const possiblePort = await getPort({ port: requiredPort });
    return requiredPort !== possiblePort ?
      this.findAvailablePort(increment + 1) : requiredPort;
  }
}
