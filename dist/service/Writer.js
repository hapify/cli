/*! hapify-cli 2019-03-03 */

"use strict";var __decorate=this&&this.__decorate||function(t,e,r,i){var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,i);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a},__metadata=this&&this.__metadata||function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=this&&this.__awaiter||function(t,e,r,i){return new(r||(r=Promise))(function(n,o){function a(t){try{f(i.next(t))}catch(t){o(t)}}function c(t){try{f(i.throw(t))}catch(t){o(t)}}function f(t){t.done?n(t.value):new r(function(e){e(t.value)}).then(a,c)}f((i=i.apply(t,e||[])).next())})},__importStar=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e},__importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),Fs=__importStar(require("fs")),Path=__importStar(require("path")),mkdirp_1=__importDefault(require("mkdirp")),jszip_1=__importDefault(require("jszip"));let WriterService=class{constructor(){}zip(t,e){return __awaiter(this,void 0,void 0,function*(){const r=new jszip_1.default;for(const t of e)r.file(t.path,t.content);const i=yield r.generateAsync({type:"nodebuffer",compression:"DEFLATE",compressionOptions:{level:9}});mkdirp_1.default.sync(Path.dirname(t)),Fs.writeFileSync(t,i)})}writeMany(t,e){return __awaiter(this,void 0,void 0,function*(){for(const r of e)yield this.write(t,r)})}write(t,e){return __awaiter(this,void 0,void 0,function*(){const r=Path.join(t,e.path);mkdirp_1.default.sync(Path.dirname(r)),Fs.writeFileSync(r,e.content,"utf8")})}};WriterService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[])],WriterService),exports.WriterService=WriterService;