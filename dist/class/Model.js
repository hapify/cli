"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface");
const _1 = require("./");
class Model {
    /** Constructor */
    constructor() {
        /** @type IContexts The model privacy context */
        this.contexts = {
            create: interface_1.Context.GUEST,
            read: interface_1.Context.GUEST,
            update: interface_1.Context.GUEST,
            remove: interface_1.Context.GUEST,
            search: interface_1.Context.GUEST,
            count: interface_1.Context.GUEST,
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
        if (object.contexts) {
            this.contexts = object.contexts;
        }
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            fields: this.fields.map((field) => field.toObject()),
            contexts: this.contexts
        };
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map