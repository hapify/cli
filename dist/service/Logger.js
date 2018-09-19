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
const _1 = require("./");
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
     * @return {LoggerService}
     */
    handle(error) {
        const message = this.optionsService.debug() ?
            error.stack.toString() : error.toString();
        console.error(chalk_1.default.red(message));
        return this;
    }
    /**
     * Display a message
     * @param {string} message
     * @return {LoggerService}
     */
    raw(message) {
        console.log(message);
        return this;
    }
    /**
     * Display a success message
     * @param {string} message
     * @return {LoggerService}
     */
    success(message) {
        console.log(`${chalk_1.default.green('✓')} ${message}`);
        return this;
    }
    /**
     * Display an info
     * @param {string} message
     * @return {LoggerService}
     */
    info(message) {
        console.log(`${chalk_1.default.blueBright('•')} ${message}`);
        return this;
    }
    /**
     * Display an info if in debug mode
     * @param {string} message
     * @return {LoggerService}
     */
    debug(message) {
        if (this.optionsService.debug()) {
            console.log(`${chalk_1.default.blueBright('•')} ${message}`);
        }
        return this;
    }
    /**
     * Display an error
     * @param {string} message
     */
    error(message) {
        console.log(`${chalk_1.default.red('✖')} ${message}`);
        return this;
    }
    /**
     * Add new lines
     * @param {number} count
     * @return {LoggerService}
     */
    newLine(count = 1) {
        console.log(`\n`.repeat(count - 1));
        return this;
    }
    /**
     * Display an error
     * @param {string} message
     * @return {LoggerService}
     */
    warning(message) {
        console.log(`${chalk_1.default.yellow('!')} ${message}`);
        return this;
    }
    /**
     * Display ascii art
     * @return {LoggerService}
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
        return this;
    }
    /**
     * Display the running time
     * @return {LoggerService}
     */
    time() {
        const message = `Process ran in ${process.uptime()}`;
        console.log(message);
        return this;
    }
};
LoggerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [_1.OptionsService])
], LoggerService);
exports.LoggerService = LoggerService;
//# sourceMappingURL=Logger.js.map