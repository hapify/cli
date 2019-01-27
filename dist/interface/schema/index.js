"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./Model"));
__export(require("./Field"));
__export(require("./Access"));
__export(require("./Channel"));
__export(require("./Template"));
__export(require("./ValidatorResult"));
function TransformValidationMessage(error) {
    if (error.details && error.details.length) {
        error.message = error.details.map(d => `${d.message} (${d.path.join('.')})`).join('. ');
    }
    return error;
}
exports.TransformValidationMessage = TransformValidationMessage;
//# sourceMappingURL=index.js.map