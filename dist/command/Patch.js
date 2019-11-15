/*! hapify-cli 2019-11-15 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))(function(o,r){function s(e){try{u(n.next(e))}catch(e){r(e)}}function c(e){try{u(n.throw(e))}catch(e){r(e)}}function u(e){e.done?o(e.value):new i(function(t){t(e.value)}).then(s,c)}u((n=n.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),service_1=require("../service"),question_1=require("./question"),SimpleGit=require("simple-git/promise"),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService);function PatchCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e);const t={},i=options.dir(),n=SimpleGit(i);yield question_1.AskDiff(e,t,n);const o=yield question_1.ApplyDiff(t,n);null===o?logger.info("Aborted"):logger.success(`Success:\n${o}`),logger.time()}catch(e){logger.handle(e)}})}exports.PatchCommand=PatchCommand;