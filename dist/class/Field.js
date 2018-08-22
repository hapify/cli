"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FieldType_1 = require("./FieldType");
class Field {
    /** Constructor */
    constructor() { }
    /**
     * Bind properties from the base object to this object
     * @param {IField} object
     * @returns {Field}
     *  Returns this
     */
    fromObject(object) {
        this.name = object.name;
        this.type = object.type;
        this.subtype = object.subtype;
        this.reference = object.reference;
        this.primary = !!object.primary;
        this.unique = !!object.unique;
        this.label = !!object.label;
        this.nullable = !!object.nullable;
        this.multiple = !!object.multiple;
        this.searchable = !!object.searchable;
        this.sortable = !!object.sortable;
        this.isPrivate = !!object.isPrivate;
        this.internal = !!object.internal;
        this.important = !!object.important;
        return this;
    }
    /**
     * Convert the instance to an object
     * @returns {IField}
     */
    toObject() {
        return {
            name: this.name,
            type: this.type,
            subtype: this.subtype,
            reference: this.type === FieldType_1.FieldType.Entity ? this.reference : null,
            primary: this.primary,
            unique: this.unique,
            label: this.label,
            nullable: this.nullable,
            multiple: this.multiple,
            searchable: this.searchable,
            sortable: this.sortable,
            isPrivate: this.isPrivate,
            internal: this.internal,
            important: this.important
        };
    }
}
exports.Field = Field;
//# sourceMappingURL=Field.js.map