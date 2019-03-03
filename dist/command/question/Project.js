/*! hapify-cli 2019-03-02 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,i,r){return new(i||(i=Promise))(function(n,o){function c(e){try{s(r.next(e))}catch(e){o(e)}}function a(e){try{s(r.throw(e))}catch(e){o(e)}}function s(e){e.done?n(e.value):new i(function(t){t(e.value)}).then(c,a)}s((r=r.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const Inquirer=__importStar(require("inquirer")),typedi_1=require("typedi"),service_1=require("../../service");function AskProject(e,t){return __awaiter(this,void 0,void 0,function*(){const i=yield typedi_1.Container.get(service_1.ProjectsService).collection();if(e.project)t.id=e.project;else if(e.projectName)t.name=e.projectName,t.description=e.projectDescription;else{const e=(yield i.list()).map(e=>({name:e.name,value:e.id})),r=yield Inquirer.prompt([{name:"id",message:"Choose a project",type:"list",choices:[{name:"Create a new project",value:null},new Inquirer.Separator,...e],when:()=>e.length>0},{name:"name",message:"Enter a project name",when:e=>!e.id,validate:e=>e.length>0},{name:"description",message:"Enter a project description",when:e=>!e.id}]);t.id=r.id,t.name=r.name,t.description=r.description}if(!t.id&&!t.name)throw new Error("No project is defined")})}function SetupProject(e){return __awaiter(this,void 0,void 0,function*(){const t=yield typedi_1.Container.get(service_1.ProjectsService).collection();if(!e.id){const i=yield t.add(e.name,e.description);e.id=i.id}})}exports.AskProject=AskProject,exports.SetupProject=SetupProject;