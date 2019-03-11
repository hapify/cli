/*! hapify-cli 2019-03-11 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,n){var a,i=arguments.length,c=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,r,n);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(c=(i<3?a(c):i>3?a(t,r,c):a(t,r))||c);return i>3&&c&&Object.defineProperty(t,r,c),c},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(a,i){function c(e){try{l(n.next(e))}catch(e){i(e)}}function o(e){try{l(n.throw(e))}catch(e){i(e)}}function l(e){e.done?a(e.value):new r(function(t){t(e.value)}).then(c,o)}l((n=n.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),interface_1=require("../../interface"),Channels_1=require("../Channels"),Generator_1=require("../Generator"),class_1=require("../../class"),Joi=__importStar(require("joi"));let TemplatePreviewHandlerService=class{constructor(e,t){this.channelsService=e,this.generatorService=t}canHandle(e){return e.id===interface_1.WebSocketMessages.PREVIEW_TEMPLATE}validator(){return Joi.object({model:Joi.string(),channel:Joi.string().required(),template:interface_1.TemplateSchema.required()})}handle(e){return __awaiter(this,void 0,void 0,function*(){const t=(yield this.channelsService.channels()).find(t=>t.id===e.data.channel);if(!t)throw new Error(`Unable to find channel ${e.data.channel}`);const r=e.data.model?yield t.modelsCollection.find(e.data.model):null,n=new class_1.Template(t,e.data.template);return this.generatorService.run(n,r)})}};TemplatePreviewHandlerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Channels_1.ChannelsService,Generator_1.GeneratorService])],TemplatePreviewHandlerService),exports.TemplatePreviewHandlerService=TemplatePreviewHandlerService;