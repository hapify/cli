/*! hapify-cli 2019-11-15 */

"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const vm2_1=require("vm2"),SECOND=1e3;class OutputError extends Error{constructor(){super(...arguments),this.code=6001,this.name="VmOutputError"}}exports.OutputError=OutputError;class EvaluationError extends Error{constructor(){super(...arguments),this.code=6002,this.name="VmEvaluationError",this.lineNumber=null,this.columnNumber=null,this.details=null}}exports.EvaluationError=EvaluationError;class TimeoutError extends Error{constructor(){super(...arguments),this.code=6003,this.name="VmTimeoutError"}}exports.TimeoutError=TimeoutError;class IntegrityError extends Error{constructor(){super(...arguments),this.code=6004,this.name="VmIntegrityError"}}exports.IntegrityError=IntegrityError;class HapifyVM{constructor(r={}){this.defaultOptions={timeout:SECOND,allowAnyOutput:!1},this.stackRegex=/vm\.js:([0-9]+):([0-9]+)/m,this.options=Object.assign({},this.defaultOptions,r)}wrap(r){return`(function() {\n${r}\n })()`}run(r,t){let e;const o=new vm2_1.VM({timeout:this.options.timeout,sandbox:Object.assign(t,this.forbiddenObjects),compiler:"javascript",eval:!1,wasm:!1}),s=this.wrap(r);try{e=o.run(s)}catch(r){if("string"!=typeof r.message||"string"!=typeof r.stack)throw new IntegrityError("Invalid error");if("Script execution timed out."===r.message)throw new TimeoutError(`Script execution timed out. (${this.options.timeout}ms)`);const t=new EvaluationError(r.message),e=this.stackRegex.exec(r.stack);if(e){const r=Number(e[1]),o=Number(e[2]);t.details=`Error: ${t.message}. Line: ${r}, Column: ${o}`,t.lineNumber=r-1,t.columnNumber=o}throw t}if(!this.options.allowAnyOutput&&void 0!==e&&"string"!=typeof e)throw new OutputError("Must return a string");return e}}exports.HapifyVM=HapifyVM;