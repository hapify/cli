/*! hapify-cli 2019-11-15 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,i){var n,a=arguments.length,o=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(o=(a<3?n(o):a>3?n(t,r,o):n(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},__awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(n,a){function o(e){try{l(i.next(e))}catch(e){a(e)}}function c(e){try{l(i.throw(e))}catch(e){a(e)}}function l(e){e.done?n(e.value):new r(function(t){t(e.value)}).then(o,c)}l((i=i.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),SingleSave_1=require("./SingleSave");let TemplatesFileStorageService=class extends SingleSave_1.SingleSaveFileStorage{serialize(e){return __awaiter(this,void 0,void 0,function*(){return e})}deserialize(e){return __awaiter(this,void 0,void 0,function*(){return e})}};TemplatesFileStorageService=__decorate([typedi_1.Service()],TemplatesFileStorageService),exports.TemplatesFileStorageService=TemplatesFileStorageService;