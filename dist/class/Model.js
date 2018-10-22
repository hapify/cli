"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface");
const _1 = require("./");
class Model {
    /** Constructor */
    constructor() {
        /** @type IAccesses The model privacy access */
        this.accesses = {
            create: interface_1.Access.GUEST,
            read: interface_1.Access.GUEST,
            update: interface_1.Access.GUEST,
            remove: interface_1.Access.GUEST,
            search: interface_1.Access.GUEST,
            count: interface_1.Access.GUEST,
        };
    }
    /** @inheritDoc */
    fromObject(object) {
        this.id = object.id;
        this.name = object.name;
        this.fields = object.fields.map((fieldBase) => {
            const field = new _1.Field();
            return field.fromObject(fieldBase);
        });
        if (object.accesses) {
            this.accesses = object.accesses;
        }
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            fields: this.fields.map((field) => field.toObject()),
            accesses: this.accesses
        };
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map