/*! hapify-cli 2019-11-15 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,i){var n,a=arguments.length,c=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(c=(a<3?n(c):a>3?n(t,r,c):n(t,r))||c);return a>3&&c&&Object.defineProperty(t,r,c),c},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(n,a){function c(e){try{s(i.next(e))}catch(e){a(e)}}function o(e){try{s(i.throw(e))}catch(e){a(e)}}function s(e){e.done?n(e.value):new r(function(t){t(e.value)}).then(c,o)}s((i=i.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),interface_1=require("../../interface"),Presets_1=require("../Presets"),Joi=__importStar(require("joi"));let GetPresetsHandlerService=class{constructor(e){this.presetsService=e}canHandle(e){return e.id===interface_1.WebSocketMessages.GET_PRESETS}validator(){return Joi.any()}handle(e){return __awaiter(this,void 0,void 0,function*(){return(yield this.presetsService.collection()).toObject()})}};GetPresetsHandlerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Presets_1.PresetsService])],GetPresetsHandlerService),exports.GetPresetsHandlerService=GetPresetsHandlerService;