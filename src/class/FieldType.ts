import { FieldSubTypeValue, FieldTypeValue } from '../interface/IObjects';

export class FieldType {
	static Boolean: FieldTypeValue = 'boolean';
	static Number: FieldTypeValue = 'number';
	static String: FieldTypeValue = 'string';
	static DateTime: FieldTypeValue = 'datetime';
	static Entity: FieldTypeValue = 'entity';
	static Object: FieldTypeValue = 'object';
	static File: FieldTypeValue = 'file';
}

export class FieldSubType {
	static Boolean = {};
	static Number = {
		Integer: <FieldSubTypeValue>'integer',
		Float: <FieldSubTypeValue>'float',
		Latitude: <FieldSubTypeValue>'latitude',
		Longitude: <FieldSubTypeValue>'longitude',
	};
	static String = {
		Email: <FieldSubTypeValue>'email',
		Password: <FieldSubTypeValue>'password',
		Url: <FieldSubTypeValue>'url',
		Text: <FieldSubTypeValue>'text',
		RichText: <FieldSubTypeValue>'rich',
	};
	static DateTime = {
		Date: <FieldSubTypeValue>'date',
		Time: <FieldSubTypeValue>'time',
	};
	static Entity = {};
	static Object = {};
	static File = {
		Image: <FieldSubTypeValue>'image',
		Video: <FieldSubTypeValue>'video',
		Audio: <FieldSubTypeValue>'audio',
		Document: <FieldSubTypeValue>'document',
	};
}
