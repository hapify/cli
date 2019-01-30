import md5 from 'md5';

export abstract class SingleSave {
	/** @type {string} The template's content's md5 hash */
	private contentMd5: { [bucket: string]: string };

	/** Constructor */
	constructor() {}

	/**
	 * Should be called after loading to hash the content
	 * @param {string} bucket
	 * @param {string} data
	 */
	didLoad(bucket: string, data: string): void {
		this.contentMd5[bucket] = md5(data);
	}

	/**
	 * Denotes if the data has changed and update the hash if necessary
	 * This method should not be called twice at the same time as it updates the hash.
	 * @param {string} bucket
	 * @param {string} data
	 * @return {boolean}
	 */
	shouldSave(bucket: string, data: string): boolean {
		const contentMd5 = md5(data);
		if (
			typeof this.contentMd5[bucket] === 'undefined' ||
			contentMd5 !== this.contentMd5[bucket]
		) {
			this.contentMd5[bucket] = contentMd5;
			return true;
		}
		return false;
	}
}
