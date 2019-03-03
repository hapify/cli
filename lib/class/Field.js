"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class Field {
    /** Constructor */
    constructor(object) {
        if (object) {
            this.fromObject(object);
        }
    }
    /** @inheritDoc */
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
        this.important = !!object.important;
        this.searchable = !!object.searchable;
        this.sortable = !!object.sortable;
        this.isPrivate = !!object.isPrivate;
        this.internal = !!object.internal;
        this.restricted = !!object.restricted;
        this.ownership = !!object.ownership;
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            name: this.name,
            type: this.type,
            subtype: this.subtype,
            reference: this.type === _1.FieldType.Entity ? this.reference : null,
            primary: this.primary,
            unique: this.unique,
            label: this.label,
            nullable: this.nullable,
            multiple: this.multiple,
            important: this.important,
            searchable: this.searchable,
            sortable: this.sortable,
            isPrivate: this.isPrivate,
            internal: this.internal,
            restricted: this.restricted,
            ownership: this.ownership
        };
    }
}
exports.Field = Field;
//# sourceMappingURL=Field.js.map