/**
 * Represent a class that can be stringified and un-stringified
 */
export interface ISerilizable<IT, T> {
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
