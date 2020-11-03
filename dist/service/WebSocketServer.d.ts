/// <reference types="node" />
import * as http from 'http';
import { LoggerService } from './Logger';
import { OptionsService } from './Options';
import { IWebSocketHandler } from '../interface/WebSocket';
export declare class WebSocketServerService {
    private optionsService;
    private loggerService;
    /** Websocket endpoint */
    private baseUri;
    /** The server instance */
    private server;
    /** Denotes if the server is started */
    private serverStarted;
    /** The path to save the token */
    private wsInfoPath;
    /** Random name to generate token */
    private randomName;
    /** Random secret to generate token */
    private randomSecret;
    /** Random secret to generate token */
    private tokenExpires;
    /** Messages handlers */
    private handlers;
    constructor(optionsService: OptionsService, loggerService: LoggerService);
    /**
     * Starts the http server
     * Check if running before starting
     * Every connection is checked against a JWT
     */
    serve(httpServer: http.Server): Promise<void>;
    /**
     * Stops the http server
     * Check if running before stop
     */
    stop(): Promise<void>;
    /** Send a message to all websocket clients */
    broadcast(data: any, type?: string): void;
    /** Denotes if the HTTP server is running */
    started(): boolean;
    /** Add a new handler */
    addHandler(handler: IWebSocketHandler<any, any>): void;
    /** Create and store token */
    private createToken;
    /** Remove the token */
    private deleteToken;
    /** Create a unique id */
    private makeId;
}
