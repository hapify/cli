/*! hapify-cli 2019-03-06 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,r,i,t){return new(i||(i=Promise))(function(l,n){function o(e){try{u(t.next(e))}catch(e){n(e)}}function a(e){try{u(t.throw(e))}catch(e){n(e)}}function u(e){e.done?l(e.value):new i(function(r){r(e.value)}).then(o,a)}u((t=t.apply(e,r||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var i in e)Object.hasOwnProperty.call(e,i)&&(r[i]=e[i]);return r.default=e,r};Object.defineProperty(exports,"__esModule",{value:!0});const Inquirer=__importStar(require("inquirer")),typedi_1=require("typedi"),service_1=require("../../service");function AskBoilerplate(e,r){return __awaiter(this,void 0,void 0,function*(){const i=yield typedi_1.Container.get(service_1.BoilerplatesService).collection();if(e.boilerplate)r.slug=e.boilerplate;else if(e.boilerplateId)r.id=e.boilerplateId;else if(e.boilerplateUrl)r.urls=[e.boilerplateUrl];else{yield addBoilerplate((yield i.list()).map(e=>({name:e.name,value:e.git_url})),r)}if(!r.id&&!r.slug&&!r.urls)throw new Error("No boilerplate is defined")})}function FindBoilerplate(e){return __awaiter(this,void 0,void 0,function*(){const r=yield typedi_1.Container.get(service_1.BoilerplatesService).collection();if(!e.urls){let i;if(e.slug?i=yield r.getBySlug(e.slug):e.id&&(i=yield r.get(e.id)),!i)throw new Error("Boilerplate not found");e.urls=[i.git_url]}})}function addBoilerplate(e,r){return __awaiter(this,void 0,void 0,function*(){const i=yield Inquirer.prompt([{name:"url",message:"Choose a boilerplate",type:"list",choices:[{name:"Enter a Git URL",value:null},new Inquirer.Separator,...e],when:()=>e.length>0},{name:"url",message:"Enter boilerplate URL",when:e=>!e.url,validate:e=>e.length>0},{name:"more",message:"Add another boilerplate?",type:"confirm",default:!1}]);r.urls||(r.urls=[]),r.urls.indexOf(i.url)<0&&r.urls.push(i.url),i.more&&(yield addBoilerplate(e,r))})}exports.AskBoilerplate=AskBoilerplate,exports.FindBoilerplate=FindBoilerplate;