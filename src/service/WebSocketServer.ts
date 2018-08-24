import { Service } from 'typedi';
import * as Path from 'path';
import * as Fs from 'fs';
import * as ws from 'ws';
import * as http from 'http';
import * as Jwt from 'jsonwebtoken';
import * as RandomString from 'randomstring';

interface TokenData { name: string; }

@Service()
export class WebSocketServerService {

  /** @type {string} Websocket endpoint */
  private baseUri: string = '/websocket';
  /** @type {ws.Server} The server instance */
  private server: ws.Server;
  /** @type {boolean} Denotes if the server is started */
  private serverStarted: boolean;

  /** @type {string} The path to save the token */
  private tokenPath: string = Path.join(Path.dirname(require.main.filename), '..', 'html', 'token.json');
  /** @type {string} Random name to generate token */
  private randomName: string = RandomString.generate({ length: 24 });
  /** @type {string} Random secret to generate token */
  private randomSecret: string = RandomString.generate({ length: 48 });
  /** @type {string} Random secret to generate token */
  private tokenExpires: number = 24 * 60 * 60 * 1000; // 1 day;

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
        const token = <string>info.req.headers.token;
        if (!token) { cb(false, 401, 'Unauthorized'); }
        else {
          Jwt.verify(token, this.randomSecret, (error: Error, decoded: TokenData) => {
            if (error || decoded.name !== this.randomName) { cb(false, 401, 'Unauthorized'); }
            else { cb(true); }
          });
        }
      }
    };
    this.server = new ws.Server(options);
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
   * Create and store token
   * @return {Promise<void>}
   */
  private async createToken(): Promise<void> {
    const token = Jwt.sign({ name: this.randomName }, this.randomSecret, { expiresIn : this.tokenExpires });
    const data = JSON.stringify({ token }, null, 2);
    Fs.writeFileSync(this.tokenPath, data, 'utf8');
  }
  /**
   * Remove the token
   * @return {Promise<void>}
   */
  private async deleteToken(): Promise<void> {
    if (Fs.existsSync(this.tokenPath)) {
      Fs.unlinkSync(this.tokenPath);
    }
  }
}
