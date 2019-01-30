"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface");
const _1 = require("./");
/** Random function */
function _p8(s) {
    const p = (Math.random().toString(16) + '000000000').substr(2, 8);
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
}
class Model {
    /** Constructor */
    constructor(object) {
        if (object) {
            this.fromObject(object);
        }
    }
    /** @inheritDoc */
    fromObject(object) {
        this.id = object.id;
        this.name = object.name;
        this.fields = object.fields.map(f => new _1.Field(f));
        this.accesses = object.accesses;
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            fields: this.fields.map(f => f.toObject()),
            accesses: this.accesses
        };
    }
    /**
     * Randomly generate id
     *
     * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
     * @returns {string}
     */
    static generateTempId() {
        return _p8() + _p8(true) + _p8(true) + _p8();
    }
    /** Get default accesses */
    static defaultAccesses() {
        return {
            create: interface_1.Access.GUEST,
            read: interface_1.Access.GUEST,
            update: interface_1.Access.GUEST,
            remove: interface_1.Access.GUEST,
            search: interface_1.Access.GUEST,
            count: interface_1.Access.GUEST
        };
    }
    /** Clone the model to a new reference */
    clone(newId) {
        const object = this.toObject();
        if (newId) {
            object.id = Model.generateTempId();
        }
        return new Model(object);
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map