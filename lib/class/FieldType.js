"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FieldType {
}
FieldType.Boolean = 'boolean';
FieldType.Number = 'number';
FieldType.String = 'string';
FieldType.DateTime = 'datetime';
FieldType.Entity = 'entity';
exports.FieldType = FieldType;
class FieldSubType {
}
FieldSubType.Boolean = {};
FieldSubType.Number = {
    Integer: 'integer',
    Float: 'float',
    Latitude: 'latitude',
    Longitude: 'longitude'
};
FieldSubType.String = {
    Email: 'email',
    Password: 'password',
    Text: 'text',
    RichText: 'rich'
};
FieldSubType.DateTime = {
    Date: 'date',
    Time: 'time'
};
FieldSubType.Entity = {};
exports.FieldSubType = FieldSubType;
//# sourceMappingURL=FieldType.js.map