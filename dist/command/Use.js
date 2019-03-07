/*! hapify-cli 2019-03-07 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,n,t,i){return new(t||(t=Promise))(function(r,o){function c(e){try{a(i.next(e))}catch(e){o(e)}}function s(e){try{a(i.throw(e))}catch(e){o(e)}}function a(e){e.done?r(e.value):new t(function(n){n(e.value)}).then(c,s)}a((i=i.apply(e,n||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),service_1=require("../service"),helpers_1=require("./helpers"),question_1=require("./question"),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService),channelsService=typedi_1.Container.get(service_1.ChannelsService);function UseCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e);const n={};yield question_1.AskProject(e,n),yield question_1.SetupProject(n),yield channelsService.changeProject(n.id);const t=yield channelsService.channels();for(const e of t)logger.success(`Did set project ${helpers_1.cHigh(n.id)} for channel ${helpers_1.cChannel(e.name)}`);logger.time()}catch(e){logger.handle(e)}})}exports.UseCommand=UseCommand;