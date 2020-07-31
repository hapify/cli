import { OptionsService } from './Options';
import { WebSocketServerService } from './WebSocketServer';
export declare class HttpServerService {
    private optionsService;
    private webSocketServerService;
    /** @type {string} WebApp root */
    private rootPath;
    /** @type {number} Start port number */
    private _minPort;
    /** @return {number} Start port getter */
    get minPort(): number;
    /** @type {number} Maximum port number */
    private _maxPort;
    /** @return {number} Maximum port getter */
    get maxPort(): number;
    /** @type {number} Current port number */
    private _port;
    /** @return {number} Current port getter */
    get port(): number;
    /** @type {http.Server} The server instance */
    private server;
    /** @type {boolean} Denotes if the server is started */
    private serverStarted;
    /**
     * Constructor
     * @param {OptionsService} optionsService
     * @param {WebSocketServerService} webSocketServerService
     */
    constructor(optionsService: OptionsService, webSocketServerService: WebSocketServerService);
    /**
     * Starts the http server
     * Check if running before starting
     * @return {Promise<void>}
     */
    serve(): Promise<void>;
    /**
     * Stops the http server
     * Check if running before stop
     * @return {Promise<void>}
     */
    stop(): Promise<void>;
    /**
     * Denotes if the HTTP server is running
     * @return {boolean}
     */
    started(): boolean;
    /**
     * Open the browser for the current server
     * Do not open if not started
     * @return {void}
     */
    open(): void;
    /**
     * Get the URL of the current session
     * Returns null if not started
     * @return {string|null}
     */
    url(): string | null;
    /**
     * Test ports and returns the first one available
     * @param {number} increment
     * @return {Promise<number>}
     */
    private findAvailablePort;
}
