/*! hapify-cli 2019-03-11 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,i){var a,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(s=(n<3?a(s):n>3?a(t,r,s):a(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(a,n){function s(e){try{d(i.next(e))}catch(e){n(e)}}function o(e){try{d(i.throw(e))}catch(e){n(e)}}function d(e){e.done?a(e.value):new r(function(t){t(e.value)}).then(s,o)}d((i=i.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),Path=__importStar(require("path")),Fs=__importStar(require("fs")),ws=__importStar(require("ws")),Jwt=__importStar(require("jsonwebtoken")),RandomString=__importStar(require("randomstring")),url_1=require("url"),Joi=__importStar(require("joi")),websocket_handlers_1=require("./websocket-handlers"),Logger_1=require("./Logger"),interface_1=require("../interface"),typedi_2=require("typedi");let WebSocketServerService=class{constructor(e){this.loggerService=e,this.baseUri="/websocket",this.wsInfoPath=Path.join(Path.dirname(require.main.filename),"..","html","ws.json"),this.randomName=RandomString.generate({length:24}),this.randomSecret=RandomString.generate({length:48}),this.tokenExpires=864e5,this.handlers=[],this.addHandler(typedi_2.Container.get(websocket_handlers_1.ApplyPresetHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.GetModelsHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.SetModelsHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.GetChannelsHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.SetChannelsHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.GetPresetsHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.GetInfoHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.NewModelHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.PathPreviewHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.TemplatePreviewHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.ValidateModelHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.GenerateTemplateHandlerService)),this.addHandler(typedi_2.Container.get(websocket_handlers_1.GenerateChannelHandlerService))}serve(e){return __awaiter(this,void 0,void 0,function*(){if(this.started())return;const t={server:e,path:this.baseUri,verifyClient:(e,t)=>{try{const r=new url_1.URL(`http://localhost${e.req.url}`).searchParams.get("token");r?Jwt.verify(r,this.randomSecret,(e,r)=>{e||r.name!==this.randomName?t(!1,401,"Unauthorized"):t(!0)}):t(!1,401,"Unauthorized")}catch(e){this.loggerService.handle(e),t(!1,500,"InternalError")}}};this.server=new ws.Server(t),this.server.on("connection",e=>{const t=this.makeId(),r=(t,r,i,a)=>{const n={id:t,data:r};i&&(n.type=i),a&&(n.tag=a),e.send(JSON.stringify(n))};this.loggerService.debug(`[WS:${t}] Did open new websocket connection`),e.on("message",e=>__awaiter(this,void 0,void 0,function*(){let i;try{const a=Joi.validate(JSON.parse(e),interface_1.WebSocketMessageSchema);if(a.error)throw a.error.data={code:4002,type:"CliMessageValidationError"},a.error;i=a.value,this.loggerService.debug(`[WS:${t}] Did receive websocket message: ${i.id}`);for(const e of this.handlers)if(e.canHandle(i)){const t=Joi.validate(i.data,e.validator());if(t.error){const{error:e}=t;throw interface_1.TransformValidationMessage(e),e.data={code:4003,type:"CliDataValidationError"},e}const a=yield e.handle(i);return void r(i.id,a,"success",i.tag)}const n=new Error(`Unknown message key ${i.id}`);throw n.data={code:4003,type:"CliUnknownMessageError"},n}catch(e){const a=i&&i.id?i.id:"error",n=i&&i.tag?i.tag:null,s={message:e.message};e.data?s.data=e.data:s.data={code:4001,type:"CliInternalError"},r(a,s,"error",n),this.loggerService.debug(`[WS:${t}] Error while processing message: ${e.message}`)}})),e.on("close",()=>{this.loggerService.debug(`[WS:${t}] Did close websocket connection`)})}),this.server.on("error",e=>{this.loggerService.handle(e)}),this.serverStarted=!0,yield this.createToken()})}stop(){return __awaiter(this,void 0,void 0,function*(){this.started()&&(this.serverStarted=!1,yield new Promise((e,t)=>{this.server.close(r=>{r?t(r):e()})}),yield this.deleteToken(),this.server=null)})}broadcast(e,t){this.started()||this.loggerService.debug("Cannot broadcast message, server is not started");for(const r of this.server.clients)r.readyState===WebSocket.OPEN&&r.send(JSON.stringify({id:"broadcast",type:t,data:e}))}started(){return this.server&&this.serverStarted}addHandler(e){this.handlers.push(e)}createToken(){return __awaiter(this,void 0,void 0,function*(){const e=this.server.address(),t=Jwt.sign({name:this.randomName},this.randomSecret,{expiresIn:this.tokenExpires}),r=JSON.stringify({url:`ws://${e.address}:${e.port}${this.baseUri}?token=${encodeURIComponent(t)}`},null,2);Fs.writeFileSync(this.wsInfoPath,r,"utf8")})}deleteToken(){return __awaiter(this,void 0,void 0,function*(){Fs.existsSync(this.wsInfoPath)&&Fs.unlinkSync(this.wsInfoPath)})}makeId(){let e="";const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let r=0;r<8;r++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}};WebSocketServerService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[Logger_1.LoggerService])],WebSocketServerService),exports.WebSocketServerService=WebSocketServerService;