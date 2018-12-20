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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const Path = __importStar(require("path"));
const http_server_1 = __importDefault(require("http-server"));
const _1 = require("./");
const WebSocketServer_1 = require("./WebSocketServer");
const Logger_1 = require("./Logger");
const opn = require('opn');
const DetectPort = require('detect-port');
let HttpServerService = class HttpServerService {
    /**
     * Constructor
     * @param {OptionsService} optionsService
     * @param {WebSocketServerService} webSocketServerService
     */
    constructor(optionsService, webSocketServerService, loggerService) {
        this.optionsService = optionsService;
        this.webSocketServerService = webSocketServerService;
        this.loggerService = loggerService;
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
    get minPort() { return this._minPort; }
    /** @return {number} Maximum port getter */
    get maxPort() { return this._maxPort; }
    /** @return {number} Current port getter */
    get port() { return this._port; }
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
            this._port = this.optionsService.port() ?
                this.optionsService.port() : yield this.findAvailablePort();
            const options = {
                root: this.rootPath,
                autoIndex: true,
                showDotfiles: false,
                showDir: false,
                cors: true,
                gzip: true
            };
            // Create server
            this.server = http_server_1.default.createServer(options).server; // wrong typing in @types/http-server
            // Bind events
            this.server.on('close', () => __awaiter(this, void 0, void 0, function* () {
                yield this.webSocketServerService.stop();
            }));
            // Start listening
            this.serverStarted = yield new Promise((resolve, reject) => {
                this.server.listen(this._port, this.optionsService.hostname(), (error) => {
                    if (error)
                        reject(error);
                    else
                        resolve(true);
                });
            });
            yield this.webSocketServerService.serve(this.server);
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
            yield new Promise((resolve, reject) => {
                this.server.close((error) => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            });
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
        return this.started() ? `http://${this.optionsService.hostname()}:${this._port}` : null;
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
            return requiredPort !== possiblePort ?
                this.findAvailablePort(increment + 1) : requiredPort;
        });
    }
};
HttpServerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [_1.OptionsService,
        WebSocketServer_1.WebSocketServerService,
        Logger_1.LoggerService])
], HttpServerService);
exports.HttpServerService = HttpServerService;
//# sourceMappingURL=HttpServer.js.map