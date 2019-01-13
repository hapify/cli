"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const Fs = __importStar(require("fs"));
const ws = __importStar(require("ws"));
const Jwt = __importStar(require("jsonwebtoken"));
const RandomString = __importStar(require("randomstring"));
const url_1 = require("url");
const Joi = __importStar(require("joi"));
const websocket_handlers_1 = require("./websocket-handlers");
const Logger_1 = require("./Logger");
const typedi_2 = require("typedi");
let WebSocketServerService = class WebSocketServerService {
    /**
     * Constructor
     * @param {LoggerService} loggerService
     */
    constructor(loggerService) {
        this.loggerService = loggerService;
        /** @type {string} Websocket endpoint */
        this.baseUri = '/websocket';
        /** @type {string} The path to save the token */
        this.wsInfoPath = Path.join(Path.dirname(require.main.filename), '..', 'html', 'ws.json');
        /** @type {string} Random name to generate token */
        this.randomName = RandomString.generate({ length: 24 });
        /** @type {string} Random secret to generate token */
        this.randomSecret = RandomString.generate({ length: 48 });
        /** @type {string} Random secret to generate token */
        this.tokenExpires = 24 * 60 * 60 * 1000; // 1 day;
        /** @type {IWebSocketHandler[]} Messages handlers */
        this.handlers = [];
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.GetModelsHandlerService));
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.SetModelsHandlerService));
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.GetChannelsHandlerService));
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.SetChannelsHandlerService));
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.GetPresetsHandlerService));
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.PathPreviewHandlerService));
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.TemplatePreviewHandlerService));
        // this.addHandler(Container.get(ValidateModelHandlerService));
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.GenerateTemplateHandlerService));
        this.addHandler(typedi_2.Container.get(websocket_handlers_1.GenerateChannelHandlerService));
    }
    /**
     * Starts the http server
     * Check if running before starting
     * Every connection is checked against a JWT
     * @param {"http".Server} httpServer
     * @return {Promise<void>}
     */
    serve(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.started())
                return;
            // Choose port
            const options = {
                server: httpServer,
                path: this.baseUri,
                verifyClient: (info, cb) => {
                    try {
                        // Use fake hostname to parse url parameters
                        const url = new url_1.URL(`http://localhost${info.req.url}`);
                        const token = url.searchParams.get('token');
                        if (!token) {
                            cb(false, 401, 'Unauthorized');
                        }
                        else {
                            Jwt.verify(token, this.randomSecret, (error, decoded) => {
                                if (error || decoded.name !== this.randomName) {
                                    cb(false, 401, 'Unauthorized');
                                }
                                else {
                                    cb(true);
                                }
                            });
                        }
                    }
                    catch (error) {
                        this.loggerService.error(error.message);
                        cb(false, 500, 'InternalError');
                    }
                }
            };
            this.server = new ws.Server(options);
            this.server.on('connection', (ws) => {
                const id = this.makeId();
                this.loggerService.debug(`[WS:${id}] Did open new websocket connection`);
                ws.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const decoded = JSON.parse(message);
                        /*
                         * Create reply methods, for success and for sending back an error
                         */
                        const send = (data, type) => {
                            ws.send(JSON.stringify({
                                id: decoded.id,
                                tag: decoded.tag,
                                type,
                                data
                            }));
                        };
                        const handleSuccess = (data) => send(data, 'success');
                        const handleError = (errorMessage, debugMessage) => {
                            send({ error: errorMessage }, 'error');
                            if (debugMessage) {
                                this.loggerService.debug(`[WS:${id}] ${debugMessage}`);
                            }
                            this.loggerService.error(errorMessage);
                        };
                        // Log for debug
                        this.loggerService.debug(`[WS:${id}] Did receive websocket message: ${decoded.id}`);
                        // Dispatch message to the right handler
                        let handled = false;
                        for (const handler of this.handlers) {
                            if (handler.canHandle(decoded)) {
                                // Validate the incoming payload
                                const validation = Joi.validate(decoded.data, handler.validator());
                                if (validation.error) {
                                    const errorMessage = validation.error.details.map((v) => v.message).join(', ');
                                    handleError(errorMessage, 'Invalid request format');
                                    return;
                                }
                                // Return the result to the client
                                yield handler.handle(decoded)
                                    .then(handleSuccess)
                                    .catch((error) => handleError(error.message, 'Error while handling the request'));
                                handled = true;
                                break;
                            }
                        }
                        // If message is not handled, send an error to the client
                        if (!handled) {
                            handleError(`Unknown message key ${decoded.id}`);
                        }
                    }
                    catch (error) {
                        ws.send(JSON.stringify({
                            id: 'error',
                            type: 'error',
                            data: { error: error.message }
                        }));
                        this.loggerService.debug(`[WS:${id}] Error while processing message`);
                        this.loggerService.error(error.message);
                    }
                }));
                ws.on('close', () => {
                    this.loggerService.debug(`[WS:${id}] Did close websocket connection`);
                });
            });
            this.server.on('error', (error) => {
                this.loggerService.error(error.message);
            });
            this.serverStarted = true;
            yield this.createToken();
        });
    }
    /**
     * Stops the http server
     * Check if running before stop
     * @return {Promise<void>}
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.started())
                return;
            this.serverStarted = false;
            yield new Promise((resolve, reject) => {
                this.server.close((error) => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            });
            yield this.deleteToken();
            this.server = null;
        });
    }
    /** Send a message to all websocket clients */
    broadcast(data, type) {
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
    started() {
        return this.server && this.serverStarted;
    }
    /**
     * Add a new handler
     * @param {IWebSocketHandler} handler
     */
    addHandler(handler) {
        this.handlers.push(handler);
    }
    /**
     * Create and store token
     * @return {Promise<void>}
     */
    createToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const wsAddress = this.server.address();
            const token = Jwt.sign({ name: this.randomName }, this.randomSecret, { expiresIn: this.tokenExpires });
            const data = JSON.stringify({
                url: `ws://${wsAddress.address}:${wsAddress.port}${this.baseUri}?token=${encodeURIComponent(token)}`
            }, null, 2);
            Fs.writeFileSync(this.wsInfoPath, data, 'utf8');
        });
    }
    /**
     * Remove the token
     * @return {Promise<void>}
     */
    deleteToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Fs.existsSync(this.wsInfoPath)) {
                Fs.unlinkSync(this.wsInfoPath);
            }
        });
    }
    /**
     * Create a unique id
     * @return {string}
     */
    makeId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 8; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
};
WebSocketServerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Logger_1.LoggerService])
], WebSocketServerService);
exports.WebSocketServerService = WebSocketServerService;
//# sourceMappingURL=WebSocketServer.js.map