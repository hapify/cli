/*! hapify-cli 2019-06-17 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,i){var a,o=arguments.length,l=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(l=(o<3?a(l):o>3?a(t,r,l):a(t,r))||l);return o>3&&l&&Object.defineProperty(t,r,l),l};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),Base_1=require("./Base");let BoilerplatesApiStorageService=class extends Base_1.BaseApiStorageService{defaultSearchParams(){const e=super.defaultSearchParams();return e._limit=this.remoteConfig.boilerplatesLimit,e}path(){return"boilerplate"}fromApi(e){return{id:e._id,slug:e.slug,name:e.name,git_url:e.git_url}}};BoilerplatesApiStorageService=__decorate([typedi_1.Service()],BoilerplatesApiStorageService),exports.BoilerplatesApiStorageService=BoilerplatesApiStorageService;