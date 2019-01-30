import { IStorable } from '../interface';
import { Channel } from './';
import { ValidatorStorageService } from '../service';

export class Validator implements IStorable {
	/** @type {string} The validator's script content */
	content: string;
	/** Validator storage */
	private storageService: ValidatorStorageService;

	/**
	 * Constructor
	 * @param {Channel} parent
	 * @param {string} path
	 */
	constructor(private parent: Channel, public path: string) {}

	/** @inheritDoc */
	public async load(): Promise<void> {
		this.content = await this.storageService.get(
			`${this.parent.path}/${this.path}`
		);
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		await this.storageService.set(
			`${this.parent.path}/${this.path}`,
			this.content
		);
	}

	/**
	 * Denotes if the validator should be considered as empty
	 * @returns {boolean}
	 */
	public isEmpty(): boolean {
		return (
			typeof this.content !== 'string' ||
			this.content === null ||
			this.content.trim().length === 0
		);
	}
}
