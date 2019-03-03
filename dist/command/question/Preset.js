/*! hapify-cli 2019-03-03 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(n,s){function o(e){try{l(i.next(e))}catch(e){s(e)}}function c(e){try{l(i.throw(e))}catch(e){s(e)}}function l(e){e.done?n(e.value):new r(function(t){t(e.value)}).then(o,c)}l((i=i.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const Inquirer=__importStar(require("inquirer")),typedi_1=require("typedi"),service_1=require("../../service");function AskPreset(e){return __awaiter(this,void 0,void 0,function*(){const t=yield typedi_1.Container.get(service_1.PresetsService).collection();let r=[];if(e.preset&&e.preset.length)r=e.preset;else{const e=(yield t.list()).map(e=>({name:e.name,value:e.id}));r=(yield Inquirer.prompt([{name:"presets",message:"Choose some presets to preload in your project",type:"checkbox",choices:e,when:()=>e.length>0}])).presets}return r})}function ApplyPreset(e){return __awaiter(this,void 0,void 0,function*(){const t=typedi_1.Container.get(service_1.LoggerService),r=typedi_1.Container.get(service_1.PresetsService),i=yield r.collection(),n=yield typedi_1.Container.get(service_1.ChannelsService).modelsCollection();if(e&&e.length){if((yield n.list()).length)t.warning("Project already contains models. Ignore presets import.");else{for(const t of e){const e=yield i.get(t),s=yield r.apply(e.models);yield n.add(s.created),yield n.update(s.updated)}yield n.save()}}})}exports.AskPreset=AskPreset,exports.ApplyPreset=ApplyPreset;