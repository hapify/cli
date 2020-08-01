"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const IObjects_1 = require("../interface/IObjects");
const Field_1 = require("./Field");
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
        this.notes = object.notes || null;
        this.fields = object.fields.map((f) => new Field_1.Field(f));
        this.accesses = object.accesses;
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            notes: this.notes || null,
            fields: this.fields.map((f) => f.toObject()),
            accesses: this.accesses,
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
            create: IObjects_1.Access.GUEST,
            read: IObjects_1.Access.GUEST,
            update: IObjects_1.Access.GUEST,
            remove: IObjects_1.Access.GUEST,
            search: IObjects_1.Access.GUEST,
            count: IObjects_1.Access.GUEST,
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