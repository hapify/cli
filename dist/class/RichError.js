"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichError = void 0;
class RichError {
    constructor(message, data) {
        this.name = 'RichError';
        this.message = message;
        if (data) {
            this.data = data;
        }
    }
}
exports.RichError = RichError;
//# sourceMappingURL=RichError.js.map