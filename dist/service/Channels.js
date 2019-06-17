/*! hapify-cli 2019-06-17 */

"use strict";var ChannelsService_1,__decorate=this&&this.__decorate||function(e,t,n,i){var r,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,n,a):r(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))(function(r,o){function a(e){try{c(i.next(e))}catch(e){o(e)}}function s(e){try{c(i.throw(e))}catch(e){o(e)}}function c(e){e.done?r(e.value):new n(function(t){t(e.value)}).then(a,s)}c((i=i.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),Path=__importStar(require("path")),Options_1=require("./Options"),Fs=__importStar(require("fs")),Hoek=__importStar(require("hoek")),class_1=require("../class");let ChannelsService=ChannelsService_1=class{constructor(e){this.optionsService=e}channels(){return __awaiter(this,void 0,void 0,function*(){if(!(this._channels instanceof Array)){if(this._channels=yield ChannelsService_1.sniff(this.optionsService.dir(),this.optionsService.depth()),0===this._channels.length)throw new Error("No channel found");for(const e of this._channels)yield e.load()}return this._channels})}ensureSameProject(){return __awaiter(this,void 0,void 0,function*(){const e=yield this.channels(),t=e[0].config.project;for(const n of e)if(n.config.project!==t)throw new Error("Channels must refer to the same project")})}ensureSameDefaultFields(){return __awaiter(this,void 0,void 0,function*(){const e=(yield this.channels()).filter(e=>!!e.config.defaultFields).map(e=>e.config.defaultFields);if(e.length<2)return;const t=e[0];for(let n=1;n<e.length;n++)if(!Hoek.deepEqual(t,e[n]))throw new Error("Default fields must match for all channels if defined")})}changeProject(e,t){return __awaiter(this,void 0,void 0,function*(){if(t)yield class_1.Channel.changeProject(t,e);else{const t=yield ChannelsService_1.sniff(this.optionsService.dir(),this.optionsService.depth());if(0===t.length)throw new Error("No channel found");for(const n of t)yield class_1.Channel.changeProject(n.path,e)}})}modelsCollection(){return __awaiter(this,void 0,void 0,function*(){return(yield this.channels())[0].modelsCollection})}static sniff(e,t=2,n=e){return __awaiter(this,void 0,void 0,function*(){const i=t<=0?[]:(yield Promise.all(Fs.readdirSync(e).map(t=>Path.join(e,t)).filter(e=>Fs.statSync(e).isDirectory()).map(e=>ChannelsService_1.sniff(e,t-1,n)))).reduce((e,t)=>e.concat(t),[]);if(yield class_1.Channel.configExists(e)){const t=Path.relative(Path.dirname(n),e),r=new class_1.Channel(e,t);i.push(r)}return i})}};ChannelsService=ChannelsService_1=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Options_1.OptionsService])],ChannelsService),exports.ChannelsService=ChannelsService;