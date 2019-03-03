/*! hapify-cli 2019-03-03 */

"use strict";var __awaiter=this&&this.__awaiter||function(t,e,i,r){return new(i||(i=Promise))(function(a,n){function s(t){try{h(r.next(t))}catch(t){n(t)}}function o(t){try{h(r.throw(t))}catch(t){n(t)}}function h(t){t.done?a(t.value):new i(function(e){e(t.value)}).then(s,o)}h((r=r.apply(t,e||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const service_1=require("../service"),typedi_1=require("typedi");class Validator{constructor(t,e){this.parent=t,this.path=e,this.storageService=typedi_1.Container.get(service_1.ValidatorFileStorageService)}load(){return __awaiter(this,void 0,void 0,function*(){yield this.validate(),this.content=yield this.storageService.get([this.parent.path,this.path])})}save(){return __awaiter(this,void 0,void 0,function*(){yield this.storageService.set([this.parent.path,this.path],this.content)})}validate(){return __awaiter(this,void 0,void 0,function*(){if(!(yield this.storageService.exists([this.parent.path,this.path])))throw new Error(`Validator's path ${this.parent.path}/${this.path} does not exists.`)})}isEmpty(){return"string"!=typeof this.content||0===this.content.trim().length}}exports.Validator=Validator;