/*! hapify-cli 2019-03-13 */

"use strict";var __decorate=this&&this.__decorate||function(e,r,t,i){var s,a=arguments.length,c=a<3?r:null===i?i=Object.getOwnPropertyDescriptor(r,t):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,r,t,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(c=(a<3?s(c):a>3?s(r,t,c):s(r,t))||c);return a>3&&c&&Object.defineProperty(r,t,c),c};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),Base_1=require("./Base");let PresetsApiStorageService=class extends Base_1.BaseApiStorageService{defaultSearchParams(){const e=super.defaultSearchParams();return e._limit=this.remoteConfig.presetsLimit,e}path(){return"preset"}fromApi(e){return{id:e._id,name:e.name,name__fr:e.name__fr,description:e.description,description__fr:e.description__fr,icon:e.icon,models:e.models.map(e=>({id:e._id,name:e.name,fields:e.fields,accesses:e.accesses}))}}};PresetsApiStorageService=__decorate([typedi_1.Service()],PresetsApiStorageService),exports.PresetsApiStorageService=PresetsApiStorageService;