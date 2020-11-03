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
exports.LoggerService = void 0;
const typedi_1 = require("typedi");
const chalk_1 = __importDefault(require("chalk"));
const Options_1 = require("./Options");
let LoggerService = class LoggerService {
    constructor(optionsService) {
        this.optionsService = optionsService;
        this.output = {
            stdout: '',
            stderr: '',
        };
    }
    /** Handle an error */
    handle(error) {
        let message = '✖ ';
        if (error.data) {
            const data = error.data;
            message += `[${data.type}:${data.code}] `;
        }
        message += error.message;
        if (this.optionsService.debug()) {
            message += `\n${error.stack.toString()}`;
        }
        this.log(chalk_1.default.red(message), 'stderr');
        return this;
    }
    /** Handle an error */
    handleAndExit(error, code = 1) {
        this.handle(error);
        process.exit(code);
        return this;
    }
    /** Display a message */
    raw(message) {
        this.log(message, 'stdout');
        return this;
    }
    /** Display a success message */
    success(message) {
        this.log(`${chalk_1.default.green('✓')} ${message}`, 'stdout');
        return this;
    }
    /** Display an info */
    info(message) {
        this.log(`${chalk_1.default.blueBright('•')} ${message}`, 'stdout');
        return this;
    }
    /** Display an info if in debug mode */
    debug(message) {
        if (this.optionsService.debug()) {
            this.log(`${chalk_1.default.cyan('*')} ${message}`, 'stdout');
        }
        return this;
    }
    /** Display an error */
    error(message) {
        this.log(`${chalk_1.default.red('✖')} ${message}`, 'stdout');
        return this;
    }
    /** Add new lines */
    newLine(count = 1) {
        this.log(`\n`.repeat(count - 1), 'stdout');
        return this;
    }
    /** Display an error */
    warning(message) {
        this.log(`${chalk_1.default.yellow('!')} ${message}`, 'stdout');
        return this;
    }
    /** Display ascii art */
    art() {
        this.log(this.getArt(), 'stdout');
        return this;
    }
    /** Get ascii art */
    getArt() {
        return chalk_1.default.magentaBright('  _    _             _  __       \n' +
            ' | |  | |           (_)/ _|      \n' +
            ' | |__| | __ _ _ __  _| |_ _   _ \n' +
            " |  __  |/ _` | '_ \\| |  _| | | |\n" +
            ' | |  | | (_| | |_) | | | | |_| |\n' +
            ' |_|  |_|\\__,_| .__/|_|_|  \\__, |\n' +
            '              | |           __/ |\n' +
            '              |_|          |___/ ');
    }
    /** Display the running time */
    time() {
        if (this.optionsService.debug()) {
            const message = `Process ran in ${process.uptime()}`;
            this.log(message, 'stdout');
        }
        return this;
    }
    log(message, type) {
        if (!this.optionsService.silent()) {
            console.log(message);
        }
        this.output[type] += message;
    }
    getOutput() {
        return this.output;
    }
};
LoggerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Options_1.OptionsService])
], LoggerService);
exports.LoggerService = LoggerService;
//# sourceMappingURL=Logger.js.map