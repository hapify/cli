/*! hapify-cli 2019-03-13 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,i){var a,o=arguments.length,n=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(a=e[c])&&(n=(o<3?a(n):o>3?a(t,r,n):a(t,r))||n);return o>3&&n&&Object.defineProperty(t,r,n),n},__awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(a,o){function n(e){try{l(i.next(e))}catch(e){o(e)}}function c(e){try{l(i.throw(e))}catch(e){o(e)}}function l(e){e.done?a(e.value):new r(function(t){t(e.value)}).then(n,c)}l((i=i.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),SingleSave_1=require("./SingleSave");let ValidatorFileStorageService=class extends SingleSave_1.SingleSaveFileStorage{serialize(e){return __awaiter(this,void 0,void 0,function*(){return e})}deserialize(e){return __awaiter(this,void 0,void 0,function*(){return e})}};ValidatorFileStorageService=__decorate([typedi_1.Service()],ValidatorFileStorageService),exports.ValidatorFileStorageService=ValidatorFileStorageService;