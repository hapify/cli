/*! hapify-cli 2019-03-11 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,i,r){return new(i||(i=Promise))(function(o,n){function l(e){try{a(r.next(e))}catch(e){n(e)}}function s(e){try{a(r.throw(e))}catch(e){n(e)}}function a(e){e.done?o(e.value):new i(function(t){t(e.value)}).then(l,s)}a((r=r.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const _1=require("./"),service_1=require("../service"),typedi_1=require("typedi");class BoilerplatesCollection{constructor(){this.boilerplates=[],this.storageService=typedi_1.Container.get(service_1.BoilerplatesApiStorageService)}static getInstance(){return __awaiter(this,void 0,void 0,function*(){return BoilerplatesCollection.instance||(BoilerplatesCollection.instance=new BoilerplatesCollection,yield BoilerplatesCollection.instance.load()),BoilerplatesCollection.instance})}load(){return __awaiter(this,void 0,void 0,function*(){this.fromObject(yield this.storageService.list())})}save(){return __awaiter(this,void 0,void 0,function*(){})}list(){return __awaiter(this,void 0,void 0,function*(){return this.boilerplates})}get(e){return __awaiter(this,void 0,void 0,function*(){return this.boilerplates.find(t=>t.id===e)})}getBySlug(e){return __awaiter(this,void 0,void 0,function*(){const t=yield this.storageService.list({_limit:1,slug:e});return t.length?new _1.Boilerplate(t[0]):null})}fromObject(e){return this.boilerplates=e.map(e=>new _1.Boilerplate(e)),this.boilerplates}toObject(){return this.boilerplates.map(e=>e.toObject())}}exports.BoilerplatesCollection=BoilerplatesCollection;