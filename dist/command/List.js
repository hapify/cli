/*! hapify-cli 2019-05-03 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))(function(i,r){function s(e){try{c(o.next(e))}catch(e){r(e)}}function l(e){try{c(o.throw(e))}catch(e){r(e)}}function c(e){e.done?i(e.value):new t(function(n){n(e.value)}).then(s,l)}c((o=o.apply(e,n||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),service_1=require("../service"),helpers_1=require("./helpers"),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService),channelsService=typedi_1.Container.get(service_1.ChannelsService);function ListCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e);const n=yield channelsService.channels();for(const e of n)helpers_1.logChannel(e);const t={};for(const e of n)void 0===t[e.modelsCollection.path]&&(t[e.modelsCollection.path]=[]),t[e.modelsCollection.path].push(e);const o=Object.keys(t);for(const e of o){const n=t[e],o=n.length>1,i=yield n[0].modelsCollection.list(),r=i.length>1;let s=`Channel${o?"s":""} ${n.map(e=>helpers_1.cChannel(e.name)).join(", ")} use${o?"":"s"} models of ${helpers_1.cPath(e)}`;0===i.length?s+="\nThere is no model yet.":s+=`\nThe model${r?"s are":" is"}:\n- ${i.map(e=>helpers_1.cModel(e.name)).join("\n- ")}`,logger.newLine().info(s)}logger.newLine(),logger.time()}catch(e){logger.handle(e)}})}exports.ListCommand=ListCommand;