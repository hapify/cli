/*! hapify-cli 2019-03-02 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,o){var i,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,o);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(n<3?i(a):n>3?i(t,r,a):i(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),Path=__importStar(require("path")),GlobalConfig_1=require("./GlobalConfig"),config_1=require("../config");let OptionsService=class{constructor(e){this.globalConfigService=e}setProgram(e){this.program=e}setCommand(e){this.command=e}remoteConfig(){return this.program.staging?config_1.RemoteConfigStaging:config_1.RemoteConfigProduction}dir(){return this.program.dir?Path.isAbsolute(this.program.dir)?this.program.dir:Path.resolve(process.cwd(),this.program.dir):process.cwd()}apiKey(){const e=this.program.key||this.globalConfigService.getData().apiKey;if(!e)throw new Error('Please define an API Key using command "hpf config" or the option "--key"');return e}debug(){return!!this.program.debug}depth(){return this.command.depth}output(){return this.command.output}port(){return this.command.port}hostname(){return this.command.hostname}open(){return!!this.command.open}};OptionsService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[GlobalConfig_1.GlobalConfigService])],OptionsService),exports.OptionsService=OptionsService;