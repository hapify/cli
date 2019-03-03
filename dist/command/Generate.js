/*! hapify-cli 2019-03-03 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,n,r,t){return new(r||(r=Promise))(function(i,o){function c(e){try{s(t.next(e))}catch(e){o(e)}}function a(e){try{s(t.throw(e))}catch(e){o(e)}}function s(e){e.done?i(e.value):new r(function(n){n(e.value)}).then(c,a)}s((t=t.apply(e,n||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),service_1=require("../service"),helpers_1=require("./helpers"),generator=typedi_1.Container.get(service_1.GeneratorService),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService),writer=typedi_1.Container.get(service_1.WriterService),channelsService=typedi_1.Container.get(service_1.ChannelsService);function GenerateCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e);const n=yield channelsService.channels();for(const e of n)helpers_1.logChannel(e);for(const e of n){const n=yield generator.runChannel(e);yield writer.writeMany(e.path,n),logger.success(`Generated ${helpers_1.cHigh(`${n.length} files`)} for channel ${helpers_1.cChannel(e.name)}`)}logger.time()}catch(e){logger.handle(e)}})}exports.GenerateCommand=GenerateCommand;