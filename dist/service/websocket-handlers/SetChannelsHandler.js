/*! hapify-cli 2019-03-02 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,n,r){var a,i=arguments.length,c=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(c=(i<3?a(c):i>3?a(t,n,c):a(t,n))||c);return i>3&&c&&Object.defineProperty(t,n,c),c},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))(function(a,i){function c(e){try{l(r.next(e))}catch(e){i(e)}}function o(e){try{l(r.throw(e))}catch(e){i(e)}}function l(e){e.done?a(e.value):new n(function(t){t(e.value)}).then(c,o)}l((r=r.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),interface_1=require("../../interface"),Channels_1=require("../Channels"),Joi=__importStar(require("joi"));let SetChannelsHandlerService=class{constructor(e){this.channelsService=e}canHandle(e){return e.id===interface_1.WebSocketMessages.SET_CHANNELS}validator(){return Joi.array().items(interface_1.ChannelSchema).min(0)}handle(e){return __awaiter(this,void 0,void 0,function*(){const t=yield this.channelsService.channels(),n=e.data;for(const e of n){const n=t.find(t=>t.id===e.id);if(!n)throw new Error(`Channel not found: ${e.name}`);n.fromObject(e),yield n.save()}})}};SetChannelsHandlerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Channels_1.ChannelsService])],SetChannelsHandlerService),exports.SetChannelsHandlerService=SetChannelsHandlerService;