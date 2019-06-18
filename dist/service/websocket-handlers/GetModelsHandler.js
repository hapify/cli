/*! hapify-cli 2019-06-17 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,n){var i,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var c=e.length-1;c>=0;c--)(i=e[c])&&(o=(a<3?i(o):a>3?i(t,r,o):i(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(i,a){function o(e){try{l(n.next(e))}catch(e){a(e)}}function c(e){try{l(n.throw(e))}catch(e){a(e)}}function l(e){e.done?i(e.value):new r(function(t){t(e.value)}).then(o,c)}l((n=n.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),interface_1=require("../../interface"),Channels_1=require("../Channels"),Joi=__importStar(require("joi"));let GetModelsHandlerService=class{constructor(e){this.channelsService=e}canHandle(e){return e.id===interface_1.WebSocketMessages.GET_MODELS}validator(){return Joi.any()}handle(e){return __awaiter(this,void 0,void 0,function*(){return(yield this.channelsService.modelsCollection()).toObject()})}};GetModelsHandlerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Channels_1.ChannelsService])],GetModelsHandlerService),exports.GetModelsHandlerService=GetModelsHandlerService;