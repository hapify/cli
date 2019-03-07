/*! hapify-cli 2019-03-07 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(i,o){function a(e){try{c(n.next(e))}catch(e){o(e)}}function s(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){e.done?i(e.value):new r(function(t){t(e.value)}).then(a,s)}c((n=n.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const Path=__importStar(require("path")),class_1=require("../class"),typedi_1=require("typedi"),service_1=require("../service"),helpers_1=require("./helpers"),generator=typedi_1.Container.get(service_1.GeneratorService),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService),writer=typedi_1.Container.get(service_1.WriterService);function ExportCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e);const t=new class_1.Channel(options.dir());yield t.load(),helpers_1.logChannel(t);const r=options.output()||Path.join(options.dir(),`${t.name}.zip`),n=yield generator.runChannel(t);yield writer.zip(r,n),logger.success(`Generated and zipped ${helpers_1.cHigh(`${n.length} files`)} for channel ${helpers_1.cChannel(t.name)} to ${helpers_1.cPath(r)}`),logger.time()}catch(e){logger.handle(e)}})}exports.ExportCommand=ExportCommand;