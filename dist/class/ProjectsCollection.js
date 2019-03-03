/*! hapify-cli 2019-03-03 */

"use strict";var __awaiter=this&&this.__awaiter||function(t,e,i,r){return new(i||(i=Promise))(function(o,n){function c(t){try{a(r.next(t))}catch(t){n(t)}}function s(t){try{a(r.throw(t))}catch(t){n(t)}}function a(t){t.done?o(t.value):new i(function(e){e(t.value)}).then(c,s)}a((r=r.apply(t,e||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const _1=require("./"),service_1=require("../service"),typedi_1=require("typedi");class ProjectsCollection{constructor(){this.projects=[],this.storageService=typedi_1.Container.get(service_1.ProjectsApiStorageService)}static getInstance(){return __awaiter(this,void 0,void 0,function*(){return ProjectsCollection.instance||(ProjectsCollection.instance=new ProjectsCollection,yield ProjectsCollection.instance.load()),ProjectsCollection.instance})}load(){return __awaiter(this,void 0,void 0,function*(){this.fromObject(yield this.storageService.list())})}save(){return __awaiter(this,void 0,void 0,function*(){})}list(){return __awaiter(this,void 0,void 0,function*(){return this.projects})}get(t){return __awaiter(this,void 0,void 0,function*(){return this.projects.find(e=>e.id===t)})}add(t,e){return __awaiter(this,void 0,void 0,function*(){const i=yield this.storageService.create({name:t,description:e.length?e:null});return new _1.Project(i)})}fromObject(t){return this.projects=t.map(t=>new _1.Project(t)),this.projects}toObject(){return this.projects.map(t=>t.toObject())}}exports.ProjectsCollection=ProjectsCollection;