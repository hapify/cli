/*! hapify-cli 2019-03-07 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,i){var n,a=arguments.length,o=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(o=(a<3?n(o):a>3?n(t,r,o):n(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(n,a){function o(e){try{l(i.next(e))}catch(e){a(e)}}function c(e){try{l(i.throw(e))}catch(e){a(e)}}function l(e){e.done?n(e.value):new r(function(t){t(e.value)}).then(o,c)}l((i=i.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),interface_1=require("../../interface"),class_1=require("../../class"),Joi=__importStar(require("joi")),Info_1=require("../Info");let NewModelHandlerService=class{constructor(e){this.infoService=e}canHandle(e){return e.id===interface_1.WebSocketMessages.NEW_MODEL}validator(){return Joi.object({name:Joi.string().required()})}handle(e){return __awaiter(this,void 0,void 0,function*(){return new class_1.Model({id:class_1.Model.generateTempId(),name:e.data.name,fields:yield this.infoService.fields(),accesses:class_1.Model.defaultAccesses()}).toObject()})}};NewModelHandlerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Info_1.InfoService])],NewModelHandlerService),exports.NewModelHandlerService=NewModelHandlerService;