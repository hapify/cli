export class FieldType {
	static Boolean = 'boolean';
	static Number = 'number';
	static String = 'string';
	static DateTime = 'datetime';
	static Entity = 'entity';
	static Object = 'object';
	static File = 'file';
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
		Url: 'url',
		Text: 'text',
		RichText: 'rich'
	};
	static DateTime = {
		Date: 'date',
		Time: 'time'
	};
	static Entity = {};
	static Object = {};
	static File = {
		Image: 'image',
		Video: 'video',
		Audio: 'audio',
		Document: 'document'
	};
}
