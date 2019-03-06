/*! hapify-cli 2019-03-06 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,i,r){return new(i||(i=Promise))(function(s,n){function o(e){try{a(r.next(e))}catch(e){n(e)}}function c(e){try{a(r.throw(e))}catch(e){n(e)}}function a(e){e.done?s(e.value):new i(function(t){t(e.value)}).then(o,c)}a((r=r.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const _1=require("./"),service_1=require("../service"),typedi_1=require("typedi");class PresetsCollection{constructor(){this.presets=[],this.storageService=typedi_1.Container.get(service_1.PresetsApiStorageService)}static getInstance(){return __awaiter(this,void 0,void 0,function*(){return PresetsCollection.instance||(PresetsCollection.instance=new PresetsCollection,yield PresetsCollection.instance.load()),PresetsCollection.instance})}load(){return __awaiter(this,void 0,void 0,function*(){this.fromObject(yield this.storageService.list())})}save(){return __awaiter(this,void 0,void 0,function*(){})}list(){return __awaiter(this,void 0,void 0,function*(){return this.presets})}get(e){return __awaiter(this,void 0,void 0,function*(){return this.presets.find(t=>t.id===e)})}fromObject(e){return this.presets=e.map(e=>new _1.Preset(e)),this.presets}toObject(){return this.presets.map(e=>e.toObject())}}exports.PresetsCollection=PresetsCollection;