"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformValidationMessage = void 0;
__exportStar(require("./Model"), exports);
__exportStar(require("./Field"), exports);
__exportStar(require("./Access"), exports);
__exportStar(require("./Channel"), exports);
__exportStar(require("./Template"), exports);
__exportStar(require("./ValidatorResult"), exports);
__exportStar(require("./Config"), exports);
__exportStar(require("./GlobalConfig"), exports);
function TransformValidationMessage(error) {
    if (error.details && error.details.length) {
        error.message = error.details
            .map(d => `${d.message} (${d.path.join('.')})`)
            .join('. ');
    }
    return error;
}
exports.TransformValidationMessage = TransformValidationMessage;
//# sourceMappingURL=index.js.map