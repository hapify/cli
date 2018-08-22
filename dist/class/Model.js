"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("./Field");
class Model {
    /** Constructor */
    constructor() { }
    /**
     * Bind properties from the base object to this object
     * @param {IModel} object
     * @returns {Model}
     *  Returns this
     */
    fromObject(object) {
        this.id = object.id;
        this.name = object.name;
        this.fields = object.fields.map((fieldBase) => {
            const field = new Field_1.Field();
            return field.fromObject(fieldBase);
        });
        return this;
    }
    /**
     * Convert the instance to an object
     * @returns {IModel}
     */
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