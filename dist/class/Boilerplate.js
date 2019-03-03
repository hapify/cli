/*! hapify-cli 2019-03-02 */

"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class Boilerplate{constructor(t){t&&this.fromObject(t)}fromObject(t){return this.id=t.id,this.slug=t.slug,this.name=t.name,this.git_url=t.git_url,this}toObject(){return{id:this.id,slug:this.slug,name:this.name,git_url:this.git_url}}}exports.Boilerplate=Boilerplate;