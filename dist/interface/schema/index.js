/*! hapify-cli 2019-03-13 */

"use strict";function __export(e){for(var r in e)exports.hasOwnProperty(r)||(exports[r]=e[r])}function TransformValidationMessage(e){return e.details&&e.details.length&&(e.message=e.details.map(e=>`${e.message} (${e.path.join(".")})`).join(". ")),e}Object.defineProperty(exports,"__esModule",{value:!0}),__export(require("./Model")),__export(require("./Field")),__export(require("./Access")),__export(require("./Channel")),__export(require("./Template")),__export(require("./ValidatorResult")),__export(require("./Config")),__export(require("./GlobalConfig")),exports.TransformValidationMessage=TransformValidationMessage;