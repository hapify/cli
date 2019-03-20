/*! hapify-cli 2019-03-20 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))(function(r,o){function s(e){try{a(i.next(e))}catch(e){o(e)}}function c(e){try{a(i.throw(e))}catch(e){o(e)}}function a(e){e.done?r(e.value):new n(function(t){t(e.value)}).then(s,c)}a((i=i.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),service_1=require("../service"),question_1=require("./question"),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService),channelsService=typedi_1.Container.get(service_1.ChannelsService);function ImportCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e),yield channelsService.ensureSameProject(),yield channelsService.ensureSameDefaultFields();const t=yield question_1.AskPreset(e);yield question_1.ApplyPreset(t),logger.time()}catch(e){logger.handle(e)}})}exports.ImportCommand=ImportCommand;