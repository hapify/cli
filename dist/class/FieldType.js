/*! hapify-cli 2019-05-28 */

"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class FieldType{}FieldType.Boolean="boolean",FieldType.Number="number",FieldType.String="string",FieldType.DateTime="datetime",FieldType.Entity="entity",FieldType.Object="object",FieldType.File="file",exports.FieldType=FieldType;class FieldSubType{}FieldSubType.Boolean={},FieldSubType.Number={Integer:"integer",Float:"float",Latitude:"latitude",Longitude:"longitude"},FieldSubType.String={Email:"email",Password:"password",Url:"url",Text:"text",RichText:"rich"},FieldSubType.DateTime={Date:"date",Time:"time"},FieldSubType.Entity={},FieldSubType.Object={},FieldSubType.File={Image:"image",Video:"video",Audio:"audio",Document:"document"},exports.FieldSubType=FieldSubType;