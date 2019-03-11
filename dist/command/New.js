/*! hapify-cli 2019-03-11 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(n,o){function s(e){try{a(i.next(e))}catch(e){o(e)}}function c(e){try{a(i.throw(e))}catch(e){o(e)}}function a(e){e.done?n(e.value):new r(function(t){t(e.value)}).then(s,c)}a((i=i.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),service_1=require("../service"),helpers_1=require("./helpers"),Rimraf=__importStar(require("rimraf")),Fs=__importStar(require("fs")),Path=__importStar(require("path")),question_1=require("./question"),SimpleGit=require("simple-git/promise"),GetDirectories=e=>Fs.readdirSync(e).map(t=>Path.join(e,t)).filter(t=>Fs.lstatSync(e).isDirectory()),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService),channelsService=typedi_1.Container.get(service_1.ChannelsService);function NewCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e);const t={},r={},i=options.dir();if(Fs.readdirSync(i).length)throw new Error("Current folder is not empty, cannot create a new project.");yield question_1.AskProject(e,t),yield question_1.AskBoilerplate(e,r);const n=yield question_1.AskPreset(e);yield question_1.SetupProject(t),yield question_1.FindBoilerplate(r);const o=SimpleGit(i),s=r.urls.length;if(s>1){for(const e of r.urls)yield o.clone(e);const e=GetDirectories(i);for(const t of e)Rimraf.sync(Path.join(t,".git"))}else yield o.clone(r.urls[0],i),Rimraf.sync(Path.join(i,".git"));yield channelsService.changeProject(t.id),yield question_1.ApplyPreset(n),logger.success(`Created ${s} new dynamic boilerplate${s>1?"s":""} in ${helpers_1.cPath(i)}. Run 'hpf serve' to edit.`),logger.time()}catch(e){logger.handle(e)}})}exports.NewCommand=NewCommand;