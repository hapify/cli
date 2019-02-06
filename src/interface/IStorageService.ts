/**
 * Represent a class that can be loaded and saved
 */
export interface IStorageService<T> {
	/** List items */
	list(query: any): Promise<T[]>;
	/** List items */
	get(id: any): Promise<T>;
}
