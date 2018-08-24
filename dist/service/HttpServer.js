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
const util = __importStar(require("util"));
const http_server_1 = __importDefault(require("http-server"));
const Options_1 = require("./Options");
const getPort = require('get-port');
let HttpServerService = class HttpServerService {
    /**
     * Constructor
     * @param {OptionsService} optionsService
     */
    constructor(optionsService) {
        this.optionsService = optionsService;
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
     * @return {Promise<void>}
     */
    serve() {
        return __awaiter(this, void 0, void 0, function* () {
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
            this.server = http_server_1.default.createServer(options);
            this.server.listen(this._port, this.optionsService.hostname());
        });
    }
    /**
     * Stops the http server
     * Check if running before stop
     * @return {Promise<void>}
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.started()) {
                yield util.promisify(this.server.close)();
            }
        });
    }
    /**
     * Denotes if the HTTP server is running
     * @return {boolean}
     */
    started() {
        return this.server && this.server.listening;
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
            const possiblePort = yield getPort({ port: requiredPort });
            return requiredPort !== possiblePort ?
                this.findAvailablePort(increment + 1) : requiredPort;
        });
    }
};
HttpServerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Options_1.OptionsService])
], HttpServerService);
exports.HttpServerService = HttpServerService;
//# sourceMappingURL=HttpServer.js.map