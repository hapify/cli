import { Container, Service } from 'typedi';
import * as Path from 'path';
import * as Fs from 'fs';
import * as ws from 'ws';
import { AddressInfo } from 'ws';
import * as http from 'http';
import * as Jwt from 'jsonwebtoken';
import * as RandomString from 'randomstring';
import { URL } from 'url';
import * as Joi from 'joi';
import { LoggerService } from './Logger';
import { OptionsService } from './Options';
import { ApplyPresetHandlerService } from './websocket-handlers/ApplyPresetHandler';
import { GetModelsHandlerService } from './websocket-handlers/GetModelsHandler';
import { SetModelsHandlerService } from './websocket-handlers/SetModelsHandler';
import { GetChannelsHandlerService } from './websocket-handlers/GetChannelsHandler';
import { SetChannelsHandlerService } from './websocket-handlers/SetChannelsHandler';
import { TemplatePreviewHandlerService } from './websocket-handlers/TemplatePreviewHandler';
import { PathPreviewHandlerService } from './websocket-handlers/PathPreviewHandler';
import { ValidateModelHandlerService } from './websocket-handlers/ValidateModelHandler';
import { NewModelHandlerService } from './websocket-handlers/NewModelHandler';
import { GetInfoHandlerService } from './websocket-handlers/GetInfoHandler';
import { GetPresetsHandlerService } from './websocket-handlers/GetPresetsHandler';
import { GenerateChannelHandlerService } from './websocket-handlers/GenerateChannelHandler';
import { GenerateTemplateHandlerService } from './websocket-handlers/GenerateTemplateHandler';
import { IWebSocketHandler, WebSocket, WebSocketMessage, WebSocketMessageSchema } from '../interface/WebSocket';
import { TransformValidationMessage } from '../interface/schema/ValidatorResult';

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
	private wsInfoPath: string = Path.join(Path.dirname(require.main.filename), '..', 'node_modules', 'hapify-gui', 'dist', 'hapify-gui', 'ws.json');
	/** @type {string} Random name to generate token */
	private randomName: string = RandomString.generate({ length: 24 });
	/** @type {string} Random secret to generate token */
	private randomSecret: string = RandomString.generate({ length: 48 });
	/** @type {string} Random secret to generate token */
	private tokenExpires: number = 24 * 60 * 60 * 1000; // 1 day;
	/** @type {IWebSocketHandler[]} Messages handlers */
	private handlers: IWebSocketHandler[] = [];

	/**
	 * Constructor
	 * @param {OptionsService} optionsService
	 * @param {LoggerService} loggerService
	 */
	constructor(private optionsService: OptionsService, private loggerService: LoggerService) {
		this.addHandler(Container.get(ApplyPresetHandlerService));
		this.addHandler(Container.get(GetModelsHandlerService));
		this.addHandler(Container.get(SetModelsHandlerService));
		this.addHandler(Container.get(GetChannelsHandlerService));
		this.addHandler(Container.get(SetChannelsHandlerService));
		this.addHandler(Container.get(GetPresetsHandlerService));
		this.addHandler(Container.get(GetInfoHandlerService));
		this.addHandler(Container.get(NewModelHandlerService));
		this.addHandler(Container.get(PathPreviewHandlerService));
		this.addHandler(Container.get(TemplatePreviewHandlerService));
		this.addHandler(Container.get(ValidateModelHandlerService));
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
					this.loggerService.handle(error);
					cb(false, 500, 'InternalError');
				}
			},
		};
		this.server = new ws.Server(options);

		this.server.on('connection', (ws: any) => {
			// Create unique id for this connection
			const id = this.makeId();

			// Create a reply method for this connection
			const reply = (id: WebSocketMessage, data: any, type?: string, tag?: string) => {
				const payload: WebSocket = { id, data };
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
				let decoded: WebSocket;

				try {
					// Decode and verify message
					const parsed = Joi.validate(JSON.parse(message), WebSocketMessageSchema) as Joi.ValidationResult<WebSocket>;
					if (parsed.error) {
						(parsed.error as any).data = {
							code: 4002,
							type: 'CliMessageValidationError',
						};
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
								const { error } = validation;
								// Transform Joi message
								TransformValidationMessage(error);
								// Add metadata
								(error as any).data = {
									code: 4003,
									type: 'CliDataValidationError',
								};
								throw error;
							}

							// Return the result to the client
							const data = await handler.handle(decoded);
							reply(decoded.id, data, 'success', decoded.tag);
							return;
						}
					}

					// If message is not handled, send an error to the client
					const error = new Error(`Unknown message key ${decoded.id}`);
					(error as any).data = {
						code: 4003,
						type: 'CliUnknownMessageError',
					};
					throw error;
				} catch (error) {
					const dId = decoded && decoded.id ? decoded.id : 'error';
					const tag = decoded && decoded.tag ? decoded.tag : null;
					const payload: any = { message: error.message };

					if (error.data) {
						payload.data = error.data;
					} else {
						payload.data = {
							code: 4001,
							type: 'CliInternalError',
						};
					}

					reply(dId, payload, 'error', tag);

					this.loggerService.debug(`[WS:${id}] Error while processing message: ${error.message}`);
				}
			});

			ws.on('close', () => {
				this.loggerService.debug(`[WS:${id}] Did close websocket connection`);
			});
		});

		this.server.on('error', (error: Error) => {
			this.loggerService.handle(error);
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
				client.send(JSON.stringify({ id: 'broadcast', type, data }));
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
		const token = Jwt.sign({ name: this.randomName }, this.randomSecret, {
			expiresIn: this.tokenExpires,
		});
		const data = JSON.stringify(
			{
				url: `ws://${this.optionsService.hostname()}:${wsAddress.port}${this.baseUri}?token=${encodeURIComponent(token)}`,
			},
			null,
			2
		);
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
