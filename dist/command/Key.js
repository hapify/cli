/*! hapify-cli 2019-11-15 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))(function(o,r){function a(e){try{s(n.next(e))}catch(e){r(e)}}function c(e){try{s(n.throw(e))}catch(e){r(e)}}function s(e){e.done?o(e.value):new i(function(t){t(e.value)}).then(a,c)}s((n=n.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),service_1=require("../service"),globalConfig=typedi_1.Container.get(service_1.GlobalConfigService),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService);function KeyCommand(e,t){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(t);const i=globalConfig.getData();i.apiKey=e,globalConfig.setData(i),logger.success("Did update global api key"),logger.time()}catch(e){logger.handle(e)}})}exports.KeyCommand=KeyCommand;