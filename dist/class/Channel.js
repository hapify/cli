/*! hapify-cli 2019-05-28 */

"use strict";var __awaiter=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))(function(a,r){function o(e){try{l(n.next(e))}catch(e){r(e)}}function s(e){try{l(n.throw(e))}catch(e){r(e)}}function l(e){e.done?a(e.value):new i(function(t){t(e.value)}).then(o,s)}l((n=n.apply(e,t||[])).next())})},__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});const Path=__importStar(require("path")),interface_1=require("../interface"),_1=require("./"),enum_1=require("../enum"),md5_1=__importDefault(require("md5")),Joi=__importStar(require("joi")),FieldType_1=require("./FieldType"),typedi_1=require("typedi"),service_1=require("../service");class Channel{constructor(e,t=null){this.path=e,this.templates=[],this.storageService=typedi_1.Container.get(service_1.ChannelFileStorageService),this.name=t||Path.basename(e),this.id=md5_1.default(this.path),this.templatesPath=Path.join(this.path,Channel.defaultFolder)}load(){return __awaiter(this,void 0,void 0,function*(){yield this.validate();const e=yield this.storageService.get([this.path,Channel.configFile]),t=Joi.validate(e,interface_1.ConfigSchema);if(t.error)throw interface_1.TransformValidationMessage(t.error),t.error;this.config=e,this.config.name&&(this.name=this.config.name),this.project=yield _1.Project.getInstance(this.config.project);for(let e=0;e<this.config.templates.length;e++){const t=new _1.Template(this,Object.assign(this.config.templates[e],{content:""}));yield t.load(),this.templates.push(t)}this.modelsCollection=yield _1.ModelsCollection.getInstance(this.config.project),this.validator=new _1.Validator(this,this.config.validatorPath),yield this.validator.load()})}save(){return __awaiter(this,void 0,void 0,function*(){for(const e of this.templates)yield e.save();yield this.validator.save(),this.config.templates=this.templates.map(e=>{const t=e.toObject();return delete t.content,t}),this.config.validatorPath=this.validator.path,yield this.storageService.set([this.path,Channel.configFile],this.config);const e=this.templates.map(e=>[this.templatesPath,e.contentPath]);e.push([this.path,this.config.validatorPath]),yield this.storageService.cleanup([this.path,Channel.defaultFolder],e)})}isEmpty(){const e=this.validator.isEmpty(),t=this.templates.every(e=>e.isEmpty());return e&&t}filter(){this.templates=this.templates.filter(e=>!e.isEmpty())}validate(){return __awaiter(this,void 0,void 0,function*(){if(!(yield this.storageService.exists([this.path,Channel.configFile])))throw new Error(`Channel config's path ${this.path}/${Channel.configFile} does not exists.`)})}static changeProject(e,t){return __awaiter(this,void 0,void 0,function*(){if(!Channel.configExists(e))throw new Error(`Cannot find config file in ${e}`);const i=typedi_1.Container.get(service_1.ChannelFileStorageService),n=yield i.get([e,Channel.configFile]);n.project=t,yield i.set([e,Channel.configFile],n)})}static configExists(e){return __awaiter(this,void 0,void 0,function*(){return yield typedi_1.Container.get(service_1.ChannelFileStorageService).exists([e,Channel.configFile])})}static create(e){return __awaiter(this,void 0,void 0,function*(){if(yield Channel.configExists(e))throw new Error("A channel already exists in this directory.");const t=new Channel(e);t.config={version:"1",validatorPath:`${Channel.defaultFolder}/validator.js`,name:t.name,description:"A brand new channel",project:"projectId",defaultFields:[{name:"Id",type:FieldType_1.FieldType.String,subtype:null,reference:null,primary:!0,unique:!1,label:!1,nullable:!1,multiple:!1,embedded:!1,searchable:!1,sortable:!1,hidden:!1,internal:!0,restricted:!1,ownership:!1}],templates:[{path:"models/{kebab}/hello.js",engine:enum_1.TemplateEngine.Hpf,input:enum_1.TemplateInput.One}]};const i=new _1.Template(t,Object.assign(t.config.templates[0],{content:"// Hello <<M A>>"}));return t.templates.push(i),t.validator=new _1.Validator(t,t.config.validatorPath),t.validator.content="// Models validation script\nreturn { errors: [], warnings: [] };",t})}fromObject(e){return this.templates=e.templates.map(e=>{const t=this.templates.find(t=>t.path===e.path);return t?t.fromObject(e):new _1.Template(this,e)}),this.validator.content=e.validator,this}toObject(){return{id:this.id,name:this.name,description:this.config.description||null,logo:this.config.logo||null,templates:this.templates.map(e=>e.toObject()),validator:this.validator.content}}}Channel.defaultFolder="hapify",Channel.configFile="hapify.json",exports.Channel=Channel;