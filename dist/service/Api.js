/*! hapify-cli 2019-11-15 */

"use strict";var __decorate=this&&this.__decorate||function(t,e,i,r){var s,o=arguments.length,n=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,r);else for(var c=t.length-1;c>=0;c--)(s=t[c])&&(n=(o<3?s(n):o>3?s(e,i,n):s(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n},__metadata=this&&this.__metadata||function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=this&&this.__awaiter||function(t,e,i,r){return new(i||(i=Promise))(function(s,o){function n(t){try{a(r.next(t))}catch(t){o(t)}}function c(t){try{a(r.throw(t))}catch(t){o(t)}}function a(t){t.done?s(t.value):new i(function(e){e(t.value)}).then(n,c)}a((r=r.apply(t,e||[])).next())})},__importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),axios_1=__importDefault(require("axios")),querystring_1=__importDefault(require("querystring")),Options_1=require("./Options");class RichAxiosError{constructor(t){this.name="RichAxiosError",this.stack=t.stack,this.config=t.config,this.code=t.code,this.request=t.request,this.response=t.response,t.response&&t.response.data?(this.message=t.response.data.message,this.data=t.response.data.data):this.message=t.message}}exports.RichAxiosError=RichAxiosError;let ApiService=class{constructor(t){this.optionsService=t}client(){return this.http||(this.http=axios_1.default.create({baseURL:this.optionsService.remoteConfig().uri,headers:{"X-Api-Key":this.optionsService.apiKey()}})),this.http}get(t,e,i){return __awaiter(this,void 0,void 0,function*(){try{return yield this.client().get(this.query(t,e),i)}catch(t){throw new RichAxiosError(t)}})}post(t,e,i,r){return __awaiter(this,void 0,void 0,function*(){try{return yield this.client().post(this.query(t,i),e,r)}catch(t){throw new RichAxiosError(t)}})}patch(t,e,i,r){return __awaiter(this,void 0,void 0,function*(){try{return yield this.client().patch(this.query(t,i),e,r)}catch(t){throw new RichAxiosError(t)}})}delete(t,e,i){return __awaiter(this,void 0,void 0,function*(){try{return yield this.client().delete(this.query(t,e),i)}catch(t){throw new RichAxiosError(t)}})}query(t,e){return e?`${t}?${querystring_1.default.stringify(e)}`:t}};ApiService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Options_1.OptionsService])],ApiService),exports.ApiService=ApiService;