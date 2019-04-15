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
        this.notes = object.notes || null;
        this.type = object.type;
        this.subtype = object.subtype;
        this.reference = object.reference;
        this.primary = !!object.primary;
        this.unique = !!object.unique;
        this.label = !!object.label;
        this.nullable = !!object.nullable;
        this.multiple = !!object.multiple;
        this.embedded = !!object.embedded;
        this.searchable = !!object.searchable;
        this.sortable = !!object.sortable;
        this.hidden = !!object.hidden;
        this.internal = !!object.internal;
        this.restricted = !!object.restricted;
        this.ownership = !!object.ownership;
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            name: this.name,
            notes: this.notes || null,
            type: this.type,
            subtype: this.subtype,
            reference: this.type === _1.FieldType.Entity ? this.reference : null,
            primary: this.primary,
            unique: this.unique,
            label: this.label,
            nullable: this.nullable,
            multiple: this.multiple,
            embedded: this.embedded,
            searchable: this.searchable,
            sortable: this.sortable,
            hidden: this.hidden,
            internal: this.internal,
            restricted: this.restricted,
            ownership: this.ownership
        };
    }
}
exports.Field = Field;
//# sourceMappingURL=Field.js.map