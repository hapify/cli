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
let OptionsService = class OptionsService {
    /** Constructor */
    constructor() {
    }
    /**
     * Set program entity
     * @param {commander.CommanderStatic} program
     */
    setProgram(program) {
        this.program = program;
    }
    /**
     * Set command entity
     * @param {commander.Command} command
     */
    setCommand(command) {
        this.command = command;
    }
    /**
     * Return the working directory computed with the --dir option
     * @return {string}
     */
    dir() {
        if (this.program.dir) {
            if (Path.isAbsolute(this.program.dir)) {
                return this.program.dir;
            }
            return Path.resolve(process.cwd(), this.program.dir);
        }
        return process.cwd();
    }
    /** @return {boolean} Denotes if the debug mode is enabled */
    debug() { return !!this.program.debug; }
    /** @return {number} Get the depth for recursive search */
    depth() { return this.command.depth; }
    /** @return {string} Get the output file path */
    output() { return this.command.output; }
    /** @return {number} Get the required http port */
    port() { return this.command.port; }
    /** @return {number} Get the required http hostname */
    hostname() { return this.command.hostname; }
    /** @return {boolean} Denotes if a new tab should be opened */
    open() { return !!this.command.open; }
};
OptionsService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], OptionsService);
exports.OptionsService = OptionsService;
//# sourceMappingURL=Options.js.map