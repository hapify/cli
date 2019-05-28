/*! hapify-cli 2019-05-28 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,a,r){var c,i=arguments.length,s=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,r);else for(var n=e.length-1;n>=0;n--)(c=e[n])&&(s=(i<3?c(s):i>3?c(t,a,s):c(t,a))||s);return i>3&&s&&Object.defineProperty(t,a,s),s},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0}),require("reflect-metadata");const typedi_1=require("typedi"),Case=__importStar(require("case"));let StringService=class{constructor(){}variants(e){return{raw:e,kebab:Case.kebab(e),snake:Case.snake(e),header:Case.header(e),constant:Case.constant(e),big:Case.constant(e).replace(/_/g,"-"),capital:Case.capital(e),lower:Case.lower(e),upper:Case.upper(e),compact:Case.snake(e).replace(/_/g,""),pascal:Case.pascal(e),camel:Case.camel(e)}}};StringService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[])],StringService),exports.StringService=StringService;