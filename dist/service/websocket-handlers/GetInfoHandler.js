/*! hapify-cli 2019-03-03 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(a=(o<3?n(a):o>3?n(t,r,a):n(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(n,o){function a(e){try{f(i.next(e))}catch(e){o(e)}}function c(e){try{f(i.throw(e))}catch(e){o(e)}}function f(e){e.done?n(e.value):new r(function(t){t(e.value)}).then(a,c)}f((i=i.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),interface_1=require("../../interface"),Joi=__importStar(require("joi")),Info_1=require("../Info"),Generator_1=require("../Generator");let GetInfoHandlerService=class{constructor(e,t){this.infoService=e,this.generatorService=t}canHandle(e){return e.id===interface_1.WebSocketMessages.GET_INFO}validator(){return Joi.any()}handle(e){return __awaiter(this,void 0,void 0,function*(){return{project:yield this.infoService.project(),limits:yield this.generatorService.limits()}})}};GetInfoHandlerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Info_1.InfoService,Generator_1.GeneratorService])],GetInfoHandlerService),exports.GetInfoHandlerService=GetInfoHandlerService;