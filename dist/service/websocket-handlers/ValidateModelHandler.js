/*! hapify-cli 2019-05-03 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,a){var i,n=arguments.length,o=n<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,r):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,a);else for(var c=e.length-1;c>=0;c--)(i=e[c])&&(o=(n<3?i(o):n>3?i(t,r,o):i(t,r))||o);return n>3&&o&&Object.defineProperty(t,r,o),o},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,r,a){return new(r||(r=Promise))(function(i,n){function o(e){try{d(a.next(e))}catch(e){n(e)}}function c(e){try{d(a.throw(e))}catch(e){n(e)}}function d(e){e.done?i(e.value):new r(function(t){t(e.value)}).then(o,c)}d((a=a.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),interface_1=require("../../interface"),Validator_1=require("../Validator"),Joi=__importStar(require("joi"));let ValidateModelHandlerService=class{constructor(e){this.validatorService=e}canHandle(e){return e.id===interface_1.WebSocketMessages.VALIDATE_MODEL}validator(){return Joi.object({model:interface_1.ModelSchema,content:Joi.string().required()})}handle(e){return __awaiter(this,void 0,void 0,function*(){return yield this.validatorService.run(e.data.content,e.data.model)})}};ValidateModelHandlerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Validator_1.ValidatorService])],ValidateModelHandlerService),exports.ValidateModelHandlerService=ValidateModelHandlerService;