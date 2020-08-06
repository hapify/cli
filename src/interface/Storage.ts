/**
 * Represent a class that can be stringified and un-stringified
 */
export interface ISerializable<IT, T> {
	/**
	 * Bind properties from the base object to this object
	 * @param {IT} object
	 * @returns {T}
	 *  Returns this
	 */
	fromObject(object: IT): T;

	/**
	 * Convert the instance to an object
	 * @returns {IT}
	 */
	toObject(): IT;
}

/**
 * Represent a class that can be loaded and saved
 */
export interface IStorable {
	/** @return {Promise<void>} */
	load(): Promise<void>;

	/** @return {Promise<void>} */
	save(): Promise<void>;
}

/**
 * Represent a class that can be loaded and saved
 */
export interface IStorageService<T> {
	/** List items */
	list(query: any): Promise<T[]>;
	/** List items */
	get(id: any): Promise<T>;
}
