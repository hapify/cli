"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class Model {
    /** Constructor */
    constructor() { }
    /** @inheritDoc */
    fromObject(object) {
        this.id = object.id;
        this.name = object.name;
        this.fields = object.fields.map((fieldBase) => {
            const field = new _1.Field();
            return field.fromObject(fieldBase);
        });
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            fields: this.fields.map((field) => field.toObject())
        };
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map