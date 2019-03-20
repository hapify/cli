/*! hapify-cli 2019-03-20 */

"use strict";var ChannelFileStorageService_1,__decorate=this&&this.__decorate||function(e,t,r,i){var n,a=arguments.length,o=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(o=(a<3?n(o):a>3?n(t,r,o):n(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},__awaiter=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(n,a){function o(e){try{l(i.next(e))}catch(e){a(e)}}function c(e){try{l(i.throw(e))}catch(e){a(e)}}function l(e){e.done?n(e.value):new r(function(t){t(e.value)}).then(o,c)}l((i=i.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),SingleSave_1=require("./SingleSave"),Path=__importStar(require("path")),Fs=__importStar(require("fs"));let ChannelFileStorageService=ChannelFileStorageService_1=class extends SingleSave_1.SingleSaveFileStorage{serialize(e){return __awaiter(this,void 0,void 0,function*(){return JSON.stringify(e,null,2)})}deserialize(e){return __awaiter(this,void 0,void 0,function*(){try{return JSON.parse(e)}catch(e){throw new Error(`An error occurred while parsing Channel configuration: ${e.toString()}`)}})}cleanup(e,t){return __awaiter(this,void 0,void 0,function*(){const r=SingleSave_1.JoinPath(e),i=t.map(SingleSave_1.JoinPath),n=ChannelFileStorageService_1.listAllFiles(r);for(const e of n)i.indexOf(e)<0&&Fs.unlinkSync(e);ChannelFileStorageService_1.clearEmptyDirectories(r)})}static listAllFiles(e){const t=Fs.readdirSync(e).map(t=>Path.join(e,t)),r=t.filter(e=>Fs.statSync(e).isDirectory()).map(e=>ChannelFileStorageService_1.listAllFiles(e)).reduce((e,t)=>e.concat(t),[]);return t.filter(e=>Fs.statSync(e).isFile()).concat(r)}static clearEmptyDirectories(e){Fs.readdirSync(e).map(t=>Path.join(e,t)).filter(e=>Fs.statSync(e).isDirectory()).forEach(e=>ChannelFileStorageService_1.clearEmptyDirectories(e)),0===Fs.readdirSync(e).length&&Fs.rmdirSync(e)}};ChannelFileStorageService=ChannelFileStorageService_1=__decorate([typedi_1.Service()],ChannelFileStorageService),exports.ChannelFileStorageService=ChannelFileStorageService;