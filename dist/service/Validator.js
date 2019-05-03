/*! hapify-cli 2019-05-03 */

"use strict";var __decorate=this&&this.__decorate||function(e,t,r,a){var i,o=arguments.length,n=o<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,r):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,a);else for(var c=e.length-1;c>=0;c--)(i=e[c])&&(n=(o<3?i(n):o>3?i(t,r,n):i(t,r))||n);return o>3&&n&&Object.defineProperty(t,r,n),n},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__awaiter=this&&this.__awaiter||function(e,t,r,a){return new(r||(r=Promise))(function(i,o){function n(e){try{l(a.next(e))}catch(e){o(e)}}function c(e){try{l(a.throw(e))}catch(e){o(e)}}function l(e){e.done?i(e.value):new r(function(t){t(e.value)}).then(n,c)}l((a=a.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});const typedi_1=require("typedi"),interface_1=require("../interface"),config_1=require("../config"),ErrorStackParser=__importStar(require("error-stack-parser")),class_1=require("../class"),{SaferEval:SaferEval}=require("safer-eval"),Joi=__importStar(require("joi"));let ValidatorService=class{constructor(){}run(e,t){return __awaiter(this,void 0,void 0,function*(){let r;try{const a=`(function() { \n${e}\n })()`;r=new SaferEval({model:t},{filename:"js-validator.js",timeout:config_1.InternalConfig.validatorTimeout,lineOffset:-1,contextCodeGeneration:{strings:!1,wasm:!1}}).runInContext(a)}catch(e){if("Script execution timed out."===e.message)throw new class_1.RichError(`Template processing timed out (${config_1.InternalConfig.validatorTimeout}ms)`,{code:4006,type:"CliValidatorTimeoutError"});const{lineNumber:t,columnNumber:r}=ErrorStackParser.parse(e)[0];throw new class_1.RichError(e.message,{code:4005,type:"CliValidatorEvaluationError",details:`Error: ${e.message}. Line: ${t}, Column: ${r}`,lineNumber:t,columnNumber:r})}if(Joi.validate(r,interface_1.ValidatorResultSchema).error)throw new class_1.RichError("Invalid validator output. Must return { errors: string[], warnings: string[] }",{code:4007,type:"CliValidatorOutputError"});return r})}};ValidatorService=__decorate([typedi_1.Service(),__metadata("design:paramtypes",[])],ValidatorService),exports.ValidatorService=ValidatorService;