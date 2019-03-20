/*! hapify-cli 2019-03-20 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,i,o){return new(i||(i=Promise))(function(r,s){function n(e){try{d(o.next(e))}catch(e){s(e)}}function c(e){try{d(o.throw(e))}catch(e){s(e)}}function d(e){e.done?r(e.value):new i(function(t){t(e.value)}).then(n,c)}d((o=o.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const _1=require("./"),typedi_1=require("typedi"),service_1=require("../service");class ModelsCollection{constructor(e){this.project=e,this.storageService=typedi_1.Container.get(service_1.ModelsApiStorageService),this.path=ModelsCollection.path(e)}static getInstance(e){return __awaiter(this,void 0,void 0,function*(){const t=ModelsCollection.path(e),i=ModelsCollection.instances.find(e=>e.path===t);if(i)return i;const o=new ModelsCollection(e);return yield o.load(),ModelsCollection.instances.push(o),o})}load(){return __awaiter(this,void 0,void 0,function*(){this.fromObject(yield this.storageService.forProject(this.project))})}save(){return __awaiter(this,void 0,void 0,function*(){const e=yield this.storageService.set(this.project,this.toObject());this.fromObject(e)})}add(e){return __awaiter(this,void 0,void 0,function*(){if(e instanceof Array)for(const t of e)yield this.add(t);else this.models.push(new _1.Model(e))})}update(e){return __awaiter(this,void 0,void 0,function*(){if(e instanceof Array)for(const t of e)yield this.update(t);else yield this.remove(e),yield this.add(e)})}remove(e){return __awaiter(this,void 0,void 0,function*(){if(e instanceof Array)for(const t of e)yield this.remove(t);else this.models=this.models.filter(t=>t.id===e.id)})}find(e){return __awaiter(this,void 0,void 0,function*(){return this.models.find(t=>t.id===e)})}list(){return __awaiter(this,void 0,void 0,function*(){return this.models})}fromObject(e){return this.models=e.map(e=>new _1.Model(e)),this.models}toObject(){return this.models.map(e=>e.toObject())}static path(e){return`project:${e}`}}ModelsCollection.instances=[],exports.ModelsCollection=ModelsCollection;