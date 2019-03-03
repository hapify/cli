/*! hapify-cli 2019-03-02 */

"use strict";var __awaiter=this&&this.__awaiter||function(t,e,i,r){return new(i||(i=Promise))(function(n,s){function c(t){try{o(r.next(t))}catch(t){s(t)}}function a(t){try{o(r.throw(t))}catch(t){s(t)}}function o(t){t.done?n(t.value):new i(function(e){e(t.value)}).then(c,a)}o((r=r.apply(t,e||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const service_1=require("../service"),typedi_1=require("typedi");class Project{constructor(t){t&&this.fromObject(t),this.storageService=typedi_1.Container.get(service_1.ProjectsApiStorageService)}static getInstance(t){return __awaiter(this,void 0,void 0,function*(){return this.instances[t]||(this.instances[t]=new Project,this.instances[t].id=t,yield this.instances[t].load()),this.instances[t]})}fromObject(t){return this.id=t.id,this.created_at=t.created_at,this.name=t.name,this.description=t.description,this}toObject(){return{id:this.id,created_at:this.created_at,name:this.name,description:this.description}}load(){return __awaiter(this,void 0,void 0,function*(){this.fromObject(yield this.storageService.get(this.id))})}save(){return __awaiter(this,void 0,void 0,function*(){})}}Project.instances={},exports.Project=Project;