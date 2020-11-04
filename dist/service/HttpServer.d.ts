import { OptionsService } from './Options';
import { WebSocketServerService } from './WebSocketServer';
export declare class HttpServerService {
    private optionsService;
    private webSocketServerService;
    /** WebApp root */
    private rootPath;
    /** Start port number */
    private _minPort;
    /** Start port getter */
    get minPort(): number;
    /** Maximum port number */
    private _maxPort;
    /** Maximum port getter */
    get maxPort(): number;
    /** Current port number */
    private _port;
    /** Current port getter */
    get port(): number;
    /** The server instance */
    private server;
    /** Denotes if the server is started */
    private serverStarted;
    constructor(optionsService: OptionsService, webSocketServerService: WebSocketServerService);
    /**
     * Starts the http server
     * Check if running before starting
     */
    serve(): Promise<void>;
    /**
     * Stops the http server
     * Check if running before stop
     */
    stop(): Promise<void>;
    /** Denotes if the HTTP server is running */
    started(): boolean;
    /**
     * Open the browser for the current server
     * Do not open if not started
     */
    open(): Promise<void>;
    /**
     * Get the URL of the current session
     * Returns null if not started
     */
    url(): string | null;
    /** Test ports and returns the first one available */
    private findAvailablePort;
}
