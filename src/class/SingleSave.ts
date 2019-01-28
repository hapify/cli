import md5 from 'md5';

export class SingleSave {
	/** @type {string} The template's content's md5 hash */
	private contentMd5: string;

	/** Constructor */
	constructor() {}

	/**
	 * Should be called after loading to hash the content
	 * @param {string} data
	 */
	didLoad(data: string): void {
		this.contentMd5 = md5(data);
	}

	/**
	 * Denotes if the data has changed and update the hash if necessary
	 * This method should not be called twice at the same time as it updates the hash.
	 * @param {string} data
	 * @return {boolean}
	 */
	shouldSave(data: string): boolean {
		const contentMd5 = md5(data);
		if (contentMd5 !== this.contentMd5) {
			this.contentMd5 = contentMd5;
			return true;
		}
		return false;
	}
}
