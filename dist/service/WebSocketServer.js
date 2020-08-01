"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServerService = void 0;
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const Fs = __importStar(require("fs"));
const ws = __importStar(require("ws"));
const Jwt = __importStar(require("jsonwebtoken"));
const RandomString = __importStar(require("randomstring"));
const url_1 = require("url");
const Joi = __importStar(require("joi"));
const Logger_1 = require("./Logger");
const typedi_2 = require("typedi");
const Options_1 = require("./Options");
const ApplyPresetHandler_1 = require("./websocket-handlers/ApplyPresetHandler");
const GetModelsHandler_1 = require("./websocket-handlers/GetModelsHandler");
const SetModelsHandler_1 = require("./websocket-handlers/SetModelsHandler");
const GetChannelsHandler_1 = require("./websocket-handlers/GetChannelsHandler");
const SetChannelsHandler_1 = require("./websocket-handlers/SetChannelsHandler");
const TemplatePreviewHandler_1 = require("./websocket-handlers/TemplatePreviewHandler");
const PathPreviewHandler_1 = require("./websocket-handlers/PathPreviewHandler");
const ValidateModelHandler_1 = require("./websocket-handlers/ValidateModelHandler");
const NewModelHandler_1 = require("./websocket-handlers/NewModelHandler");
const GetInfoHandler_1 = require("./websocket-handlers/GetInfoHandler");
const GetPresetsHandler_1 = require("./websocket-handlers/GetPresetsHandler");
const GenerateChannelHandler_1 = require("./websocket-handlers/GenerateChannelHandler");
const GenerateTemplateHandler_1 = require("./websocket-handlers/GenerateTemplateHandler");
const IWebSocketMessage_1 = require("../interface/IWebSocketMessage");
const ValidatorResult_1 = require("../interface/schema/ValidatorResult");
let WebSocketServerService = class WebSocketServerService {
    /**
     * Constructor
     * @param {OptionsService} optionsService
     * @param {LoggerService} loggerService
     */
    constructor(optionsService, loggerService) {
        this.optionsService = optionsService;
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
        this.addHandler(typedi_2.Container.get(ApplyPresetHandler_1.ApplyPresetHandlerService));
        this.addHandler(typedi_2.Container.get(GetModelsHandler_1.GetModelsHandlerService));
        this.addHandler(typedi_2.Container.get(SetModelsHandler_1.SetModelsHandlerService));
        this.addHandler(typedi_2.Container.get(GetChannelsHandler_1.GetChannelsHandlerService));
        this.addHandler(typedi_2.Container.get(SetChannelsHandler_1.SetChannelsHandlerService));
        this.addHandler(typedi_2.Container.get(GetPresetsHandler_1.GetPresetsHandlerService));
        this.addHandler(typedi_2.Container.get(GetInfoHandler_1.GetInfoHandlerService));
        this.addHandler(typedi_2.Container.get(NewModelHandler_1.NewModelHandlerService));
        this.addHandler(typedi_2.Container.get(PathPreviewHandler_1.PathPreviewHandlerService));
        this.addHandler(typedi_2.Container.get(TemplatePreviewHandler_1.TemplatePreviewHandlerService));
        this.addHandler(typedi_2.Container.get(ValidateModelHandler_1.ValidateModelHandlerService));
        this.addHandler(typedi_2.Container.get(GenerateTemplateHandler_1.GenerateTemplateHandlerService));
        this.addHandler(typedi_2.Container.get(GenerateChannelHandler_1.GenerateChannelHandlerService));
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
                        this.loggerService.handle(error);
                        cb(false, 500, 'InternalError');
                    }
                },
            };
            this.server = new ws.Server(options);
            this.server.on('connection', (ws) => {
                // Create unique id for this connection
                const id = this.makeId();
                // Create a reply method for this connection
                const reply = (id, data, type, tag) => {
                    const payload = { id, data };
                    if (type) {
                        payload.type = type;
                    }
                    if (tag) {
                        payload.tag = tag;
                    }
                    ws.send(JSON.stringify(payload));
                };
                this.loggerService.debug(`[WS:${id}] Did open new websocket connection`);
                ws.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                    let decoded;
                    try {
                        // Decode and verify message
                        const parsed = Joi.validate(JSON.parse(message), IWebSocketMessage_1.WebSocketMessageSchema);
                        if (parsed.error) {
                            parsed.error.data = {
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
                                    ValidatorResult_1.TransformValidationMessage(error);
                                    // Add metadata
                                    error.data = {
                                        code: 4003,
                                        type: 'CliDataValidationError',
                                    };
                                    throw error;
                                }
                                // Return the result to the client
                                const data = yield handler.handle(decoded);
                                reply(decoded.id, data, 'success', decoded.tag);
                                return;
                            }
                        }
                        // If message is not handled, send an error to the client
                        const error = new Error(`Unknown message key ${decoded.id}`);
                        error.data = {
                            code: 4003,
                            type: 'CliUnknownMessageError',
                        };
                        throw error;
                    }
                    catch (error) {
                        const dId = decoded && decoded.id ? decoded.id : 'error';
                        const tag = decoded && decoded.tag ? decoded.tag : null;
                        const payload = { message: error.message };
                        if (error.data) {
                            payload.data = error.data;
                        }
                        else {
                            payload.data = {
                                code: 4001,
                                type: 'CliInternalError',
                            };
                        }
                        reply(dId, payload, 'error', tag);
                        this.loggerService.debug(`[WS:${id}] Error while processing message: ${error.message}`);
                    }
                }));
                ws.on('close', () => {
                    this.loggerService.debug(`[WS:${id}] Did close websocket connection`);
                });
            });
            this.server.on('error', (error) => {
                this.loggerService.handle(error);
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
            const token = Jwt.sign({ name: this.randomName }, this.randomSecret, {
                expiresIn: this.tokenExpires,
            });
            const data = JSON.stringify({
                url: `ws://${this.optionsService.hostname()}:${wsAddress.port}${this.baseUri}?token=${encodeURIComponent(token)}`,
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
    __metadata("design:paramtypes", [Options_1.OptionsService, Logger_1.LoggerService])
], WebSocketServerService);
exports.WebSocketServerService = WebSocketServerService;
//# sourceMappingURL=WebSocketServer.js.map