/// <reference types="node" />
import * as http from 'http';
import { LoggerService } from './Logger';
import { OptionsService } from './Options';
import { IWebSocketHandler } from '../interface/IWebSocketHandler';
export declare class WebSocketServerService {
    private optionsService;
    private loggerService;
    /** @type {string} Websocket endpoint */
    private baseUri;
    /** @type {ws.Server} The server instance */
    private server;
    /** @type {boolean} Denotes if the server is started */
    private serverStarted;
    /** @type {string} The path to save the token */
    private wsInfoPath;
    /** @type {string} Random name to generate token */
    private randomName;
    /** @type {string} Random secret to generate token */
    private randomSecret;
    /** @type {string} Random secret to generate token */
    private tokenExpires;
    /** @type {IWebSocketHandler[]} Messages handlers */
    private handlers;
    /**
     * Constructor
     * @param {OptionsService} optionsService
     * @param {LoggerService} loggerService
     */
    constructor(optionsService: OptionsService, loggerService: LoggerService);
    /**
     * Starts the http server
     * Check if running before starting
     * Every connection is checked against a JWT
     * @param {"http".Server} httpServer
     * @return {Promise<void>}
     */
    serve(httpServer: http.Server): Promise<void>;
    /**
     * Stops the http server
     * Check if running before stop
     * @return {Promise<void>}
     */
    stop(): Promise<void>;
    /** Send a message to all websocket clients */
    broadcast(data: any, type?: string): void;
    /**
     * Denotes if the HTTP server is running
     * @return {boolean}
     */
    started(): boolean;
    /**
     * Add a new handler
     * @param {IWebSocketHandler} handler
     */
    addHandler(handler: IWebSocketHandler): void;
    /**
     * Create and store token
     * @return {Promise<void>}
     */
    private createToken;
    /**
     * Remove the token
     * @return {Promise<void>}
     */
    private deleteToken;
    /**
     * Create a unique id
     * @return {string}
     */
    private makeId;
}
