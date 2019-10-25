/*! hapify-cli 2019-10-25 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,o){var _,n=arguments.length,i=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,r,o);else for(var c=e.length-1;c>=0;c--)(_=e[c])&&(i=(n<3?_(i):n>3?_(t,r,i):_(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),chalk_1=__importDefault(require("chalk")),Options_1=require("./Options");let LoggerService=class{constructor(e){this.optionsService=e}handle(e){let t="✖ ";if(e.data){const r=e.data;t+=`[${r.type}:${r.code}] `}return t+=e.message,this.optionsService.debug()&&(t+=`\n${e.stack.toString()}`),console.error(chalk_1.default.red(t)),this}raw(e){return console.log(e),this}success(e){return console.log(`${chalk_1.default.green("✓")} ${e}`),this}info(e){return console.log(`${chalk_1.default.blueBright("•")} ${e}`),this}debug(e){return this.optionsService.debug()&&console.log(`${chalk_1.default.cyan("*")} ${e}`),this}error(e){return console.log(`${chalk_1.default.red("✖")} ${e}`),this}newLine(e=1){return console.log("\n".repeat(e-1)),this}warning(e){return console.log(`${chalk_1.default.yellow("!")} ${e}`),this}art(){return console.log(this.getArt()),this}getArt(){return chalk_1.default.magentaBright("  _    _             _  __       \n | |  | |           (_)/ _|      \n | |__| | __ _ _ __  _| |_ _   _ \n |  __  |/ _` | '_ \\| |  _| | | |\n | |  | | (_| | |_) | | | | |_| |\n |_|  |_|\\__,_| .__/|_|_|  \\__, |\n              | |           __/ |\n              |_|          |___/ ")}time(){if(this.optionsService.debug()){const e=`Process ran in ${process.uptime()}`;console.log(e)}return this}};LoggerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Options_1.OptionsService])],LoggerService),exports.LoggerService=LoggerService;