/*! hapify-cli 2019-03-20 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,i,t,n){return new(t||(t=Promise))(function(r,o){function s(e){try{a(n.next(e))}catch(e){o(e)}}function c(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){e.done?r(e.value):new t(function(i){i(e.value)}).then(s,c)}a((n=n.apply(e,i||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const class_1=require("../class"),typedi_1=require("typedi"),service_1=require("../service"),helpers_1=require("./helpers"),question_1=require("./question"),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService),channelsService=typedi_1.Container.get(service_1.ChannelsService);function InitCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e);const i={},t=yield class_1.Channel.create(options.dir());yield question_1.AskProject(e,i),yield question_1.SetupProject(i),yield t.save(),yield channelsService.changeProject(i.id,t.path),logger.success(`Initialized a dynamic boilerplate in ${helpers_1.cPath(options.dir())}`),logger.time()}catch(e){logger.handle(e)}})}exports.InitCommand=InitCommand;