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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const chalk_1 = __importDefault(require("chalk"));
const Options_1 = require("./Options");
let LoggerService = class LoggerService {
    /**
     * Constructor
     * @param {OptionsService} optionsService
     */
    constructor(optionsService) {
        this.optionsService = optionsService;
    }
    /**
     * Handle an error
     * @param {Error} error
     */
    handle(error) {
        const message = this.optionsService.debug() ?
            error.stack.toString() : error.toString();
        console.error(chalk_1.default.red(message));
    }
    /**
     * Display a success message
     * @param {string} message
     */
    success(message) {
        console.log(chalk_1.default.green(message));
    }
    /**
     * Display an info
     * @param {string} message
     */
    info(message) {
        console.log(chalk_1.default.blueBright(message));
    }
    /**
     * Display ascii art
     */
    art() {
        console.log(chalk_1.default.magentaBright('  _    _             _  __       \n' +
            ' | |  | |           (_)/ _|      \n' +
            ' | |__| | __ _ _ __  _| |_ _   _ \n' +
            ' |  __  |/ _` | \'_ \\| |  _| | | |\n' +
            ' | |  | | (_| | |_) | | | | |_| |\n' +
            ' |_|  |_|\\__,_| .__/|_|_|  \\__, |\n' +
            '              | |           __/ |\n' +
            '              |_|          |___/ '));
    }
    /**
     * Display the running time
     */
    time() {
        const message = `Process ran in ${process.uptime()}`;
        console.log(message);
    }
};
LoggerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Options_1.OptionsService])
], LoggerService);
exports.LoggerService = LoggerService;
//# sourceMappingURL=Logger.js.map