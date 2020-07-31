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
exports.HttpServerService = void 0;
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const Options_1 = require("./Options");
const WebSocketServer_1 = require("./WebSocketServer");
const opn = require('opn');
const DetectPort = require('detect-port');
const hapi_1 = require("@hapi/hapi");
let HttpServerService = class HttpServerService {
    /**
     * Constructor
     * @param {OptionsService} optionsService
     * @param {WebSocketServerService} webSocketServerService
     */
    constructor(optionsService, webSocketServerService) {
        this.optionsService = optionsService;
        this.webSocketServerService = webSocketServerService;
        /** @type {string} WebApp root */
        this.rootPath = Path.join(Path.dirname(require.main.filename), '..', 'html');
        /** @type {number} Start port number */
        this._minPort = 4800;
        /** @type {number} Maximum port number */
        this._maxPort = 4820;
        /** @type {number} Current port number */
        this._port = this._minPort;
    }
    /** @return {number} Start port getter */
    get minPort() {
        return this._minPort;
    }
    /** @return {number} Maximum port getter */
    get maxPort() {
        return this._maxPort;
    }
    /** @return {number} Current port getter */
    get port() {
        return this._port;
    }
    /**
     * Starts the http server
     * Check if running before starting
     * @return {Promise<void>}
     */
    serve() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.started())
                return;
            // Choose port
            this._port = this.optionsService.port()
                ? this.optionsService.port()
                : yield this.findAvailablePort();
            // Create server
            this.server = new hapi_1.Server({
                port: this._port,
                routes: {
                    cors: { credentials: true },
                    files: {
                        relativeTo: this.rootPath
                    }
                }
            });
            // Create static files handler
            yield this.server.register(require('@hapi/inert'));
            this.server.route({
                method: 'GET',
                path: '/{param*}',
                handler: {
                    directory: {
                        path: '.',
                        redirectToSlash: true,
                        index: true
                    }
                }
            });
            // Create catch-all fallback
            this.server.ext('onPreResponse', (request, h) => {
                const response = request.response;
                if (response.isBoom && response.output.statusCode === 404) {
                    return h.file('index.html').code(200);
                }
                return h.continue;
            });
            // Start server
            yield this.server.start();
            this.serverStarted = true;
            // Bind events
            this.server.listener.on('close', () => __awaiter(this, void 0, void 0, function* () {
                yield this.webSocketServerService.stop();
            }));
            yield this.webSocketServerService.serve(this.server.listener);
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
            // Stop self server
            yield this.server.stop();
            this.server = null;
        });
    }
    /**
     * Denotes if the HTTP server is running
     * @return {boolean}
     */
    started() {
        return this.server && this.serverStarted;
    }
    /**
     * Open the browser for the current server
     * Do not open if not started
     * @return {void}
     */
    open() {
        const url = this.url();
        if (url) {
            opn(url);
        }
    }
    /**
     * Get the URL of the current session
     * Returns null if not started
     * @return {string|null}
     */
    url() {
        return this.started()
            ? `http://${this.optionsService.hostname()}:${this._port}`
            : null;
    }
    /**
     * Test ports and returns the first one available
     * @param {number} increment
     * @return {Promise<number>}
     */
    findAvailablePort(increment = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._port > this._maxPort) {
                throw new Error(`Reached maximum port number ${this._maxPort} to start HTTP server`);
            }
            const requiredPort = this._port + increment;
            const possiblePort = yield DetectPort(requiredPort);
            return requiredPort !== possiblePort
                ? this.findAvailablePort(increment + 1)
                : requiredPort;
        });
    }
};
HttpServerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Options_1.OptionsService,
        WebSocketServer_1.WebSocketServerService])
], HttpServerService);
exports.HttpServerService = HttpServerService;
//# sourceMappingURL=HttpServer.js.map