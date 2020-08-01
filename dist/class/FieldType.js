"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldSubType = exports.FieldType = void 0;
class FieldType {
}
exports.FieldType = FieldType;
FieldType.Boolean = 'boolean';
FieldType.Number = 'number';
FieldType.String = 'string';
FieldType.DateTime = 'datetime';
FieldType.Entity = 'entity';
FieldType.Object = 'object';
FieldType.File = 'file';
class FieldSubType {
}
exports.FieldSubType = FieldSubType;
FieldSubType.Boolean = {};
FieldSubType.Number = {
    Integer: 'integer',
    Float: 'float',
    Latitude: 'latitude',
    Longitude: 'longitude',
};
FieldSubType.String = {
    Email: 'email',
    Password: 'password',
    Url: 'url',
    Text: 'text',
    RichText: 'rich',
};
FieldSubType.DateTime = {
    Date: 'date',
    Time: 'time',
};
FieldSubType.Entity = {};
FieldSubType.Object = {};
FieldSubType.File = {
    Image: 'image',
    Video: 'video',
    Audio: 'audio',
    Document: 'document',
};
//# sourceMappingURL=FieldType.js.map