/*! hapify-cli 2019-10-25 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,i,r){var a,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(o<3?a(n):o>3?a(t,i,n):a(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,i,r){return new(i||(i=Promise))(function(a,o){function n(e){try{c(r.next(e))}catch(e){o(e)}}function s(e){try{c(r.throw(e))}catch(e){o(e)}}function c(e){e.done?a(e.value):new i(function(t){t(e.value)}).then(n,s)}c((r=r.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),Options_1=require("../../Options"),Api_1=require("../../Api");let BaseApiStorageService=class{constructor(e,t){this.apiService=e,this.optionsService=t,this.remoteConfig=t.remoteConfig()}create(e){return __awaiter(this,void 0,void 0,function*(){const t=(yield this.apiService.post(`${this.path()}`,e)).data;return this.fromApi(t)})}update(e,t){return __awaiter(this,void 0,void 0,function*(){yield this.apiService.patch(`${this.path()}/${e}`,t)})}get(e){return __awaiter(this,void 0,void 0,function*(){const t=(yield this.apiService.get(`${this.path()}/${e}`)).data;return this.fromApi(t)})}remove(e){return __awaiter(this,void 0,void 0,function*(){yield this.apiService.delete(`${this.path()}/${e}`)})}list(e){return __awaiter(this,void 0,void 0,function*(){return(yield this.apiService.get(`${this.path()}`,Object.assign(this.defaultSearchParams(),e))).data.items.map(e=>this.fromApi(e))})}count(e){return __awaiter(this,void 0,void 0,function*(){const t=Object.assign({},this.defaultSearchParams(),e);return delete t._page,delete t._limit,delete t._order,delete t._sort,(yield this.apiService.get(`${this.path()}/count`,Object.assign(this.defaultSearchParams(),e))).data.total})}defaultSearchParams(){return{_page:0,_limit:20}}};BaseApiStorageService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Api_1.ApiService,Options_1.OptionsService])],BaseApiStorageService),exports.BaseApiStorageService=BaseApiStorageService;