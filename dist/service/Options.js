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
    attach(program) {
        this.program = program;
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
    /**
     * Denotes if the debug mode is enabled
     * @return {boolean}
     */
    debug() {
        return !!this.program.debug;
    }
};
OptionsService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], OptionsService);
exports.OptionsService = OptionsService;
//# sourceMappingURL=Options.js.map