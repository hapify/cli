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
require("reflect-metadata");
const typedi_1 = require("typedi");
const Case = __importStar(require("case"));
let StringService = class StringService {
    /**
     * Constructor
     */
    constructor() { }
    /**
     * Returns the string with all formats
     *
     * @param {string} value
     * @returns {string}
     */
    variants(value) {
        return {
            raw: value,
            kebab: Case.kebab(value),
            snake: Case.snake(value),
            header: Case.header(value),
            constant: Case.constant(value),
            big: Case.constant(value).replace(/_/g, '-'),
            capital: Case.capital(value),
            lower: Case.lower(value),
            upper: Case.upper(value),
            compact: Case.snake(value).replace(/_/g, ''),
            pascal: Case.pascal(value),
            camel: Case.camel(value)
        };
    }
};
StringService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], StringService);
exports.StringService = StringService;
//# sourceMappingURL=String.js.map