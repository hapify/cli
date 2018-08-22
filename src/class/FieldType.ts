
export class FieldType {
  static Boolean = 'boolean';
  static Number = 'number';
  static String = 'string';
  static DateTime = 'datetime';
  static Entity = 'entity';
}

export class FieldSubType {
  static Boolean = {};
  static Number = {
    Integer: 'integer',
    Float: 'float',
    Latitude: 'latitude',
    Longitude: 'longitude'
  };
  static String = {
    Email: 'email',
    Password: 'password',
    Text: 'text',
    RichText: 'rich'
  };
  static DateTime = {
    Date: 'date',
    Time: 'time'
  };
  static Entity = {};
}