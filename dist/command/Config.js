/*! hapify-cli 2019-11-15 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,i,t,n){return new(t||(t=Promise))(function(o,r){function a(e){try{c(n.next(e))}catch(e){r(e)}}function g(e){try{c(n.throw(e))}catch(e){r(e)}}function c(e){e.done?o(e.value):new t(function(i){i(e.value)}).then(a,g)}c((n=n.apply(e,i||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),service_1=require("../service"),globalConfig=typedi_1.Container.get(service_1.GlobalConfigService),options=typedi_1.Container.get(service_1.OptionsService),logger=typedi_1.Container.get(service_1.LoggerService);function ConfigCommand(e){return __awaiter(this,void 0,void 0,function*(){try{options.setCommand(e);const i=globalConfig.getData(),t=[];e.apiKey&&(i.apiKey=e.apiKey,t.push("apiKey")),e.apiUrl&&(i.apiUrl=e.apiUrl,t.push("apiUrl")),globalConfig.setData(i),t.length?logger.success(`Did update global configuration: ${t.join(", ")}`):logger.warning("Nothing updated"),logger.time()}catch(e){logger.handle(e)}})}exports.ConfigCommand=ConfigCommand;