/*! hapify-cli 2019-10-25 */

"use strict";var __decorate=this&&this.__decorate||function(e,r,t,s){var i,o=arguments.length,a=o<3?r:null===s?s=Object.getOwnPropertyDescriptor(r,t):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,r,t,s);else for(var c=e.length-1;c>=0;c--)(i=e[c])&&(a=(o<3?i(a):o>3?i(r,t,a):i(r,t))||a);return o>3&&a&&Object.defineProperty(r,t,a),a};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),Base_1=require("./Base");let PresetsApiStorageService=class extends Base_1.BaseApiStorageService{defaultSearchParams(){const e=super.defaultSearchParams();return e._limit=this.remoteConfig.presetsLimit,e}path(){return"preset"}fromApi(e){return{id:e._id,name:e.name,name__fr:e.name__fr,description:e.description,description__fr:e.description__fr,icon:e.icon,models:e.models.map(e=>({id:e._id,name:e.name,notes:e.notes||null,fields:e.fields,accesses:e.accesses}))}}};PresetsApiStorageService=__decorate([typedi_1.Service()],PresetsApiStorageService),exports.PresetsApiStorageService=PresetsApiStorageService;