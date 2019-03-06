/*! hapify-cli 2019-03-06 */

"use strict";var __decorate=this&&this.__decorate||function(t,e,i,r){var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a},__awaiter=this&&this.__awaiter||function(t,e,i,r){return new(i||(i=Promise))(function(n,o){function a(t){try{u(r.next(t))}catch(t){o(t)}}function s(t){try{u(r.throw(t))}catch(t){o(t)}}function u(t){t.done?n(t.value):new i(function(e){e(t.value)}).then(a,s)}u((r=r.apply(t,e||[])).next())})},__importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}},__importStar=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)Object.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e.default=t,e};Object.defineProperty(exports,"__esModule",{value:!0});const md5_1=__importDefault(require("md5")),typedi_1=require("typedi"),Fs=__importStar(require("fs")),mkdirp_1=__importDefault(require("mkdirp")),Path=__importStar(require("path"));function JoinPath(t){return t instanceof Array?Path.join(...t):t}exports.JoinPath=JoinPath;let SingleSaveFileStorage=class{constructor(){this.contentMd5={}}get(t){return __awaiter(this,void 0,void 0,function*(){const e=JoinPath(t),i=Fs.readFileSync(e,"utf8");return this.didLoad(e,i),yield this.deserialize(i)})}set(t,e){return __awaiter(this,void 0,void 0,function*(){const i=yield this.serialize(e),r=JoinPath(t);this.shouldSave(r,i)&&(mkdirp_1.default.sync(Path.dirname(r)),Fs.writeFileSync(r,i,"utf8"))})}exists(t){return __awaiter(this,void 0,void 0,function*(){return Fs.existsSync(JoinPath(t))})}didLoad(t,e){this.contentMd5[t]=md5_1.default(e)}shouldSave(t,e){const i=md5_1.default(e);return(void 0===this.contentMd5[t]||i!==this.contentMd5[t])&&(this.contentMd5[t]=i,!0)}};SingleSaveFileStorage=__decorate([typedi_1.Service()],SingleSaveFileStorage),exports.SingleSaveFileStorage=SingleSaveFileStorage;