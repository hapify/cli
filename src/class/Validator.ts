import { IStorable } from '../interface';
import { Channel } from './';
import { ValidatorFileStorageService } from '../service';
import { Container } from 'typedi';

export class Validator implements IStorable {
	/** @type {string} The validator's script content */
	content: string;
	/** Validator storage */
	private storageService: ValidatorFileStorageService;

	/**
	 * Constructor
	 * @param {Channel} parent
	 * @param {string} path
	 */
	constructor(private parent: Channel, public path: string) {
		this.storageService = Container.get(ValidatorFileStorageService);
	}

	/** @inheritDoc */
	public async load(): Promise<void> {
		await this.validate();
		this.content = await this.storageService.get([
			this.parent.path,
			this.path
		]);
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		await this.storageService.set(
			[this.parent.path, this.path],
			this.content
		);
	}

	/**
	 * Check resource validity
	 * @throws {Error}
	 */
	private async validate(): Promise<void> {
		if (
			!(await this.storageService.exists([this.parent.path, this.path]))
		) {
			throw new Error(
				`Validator's path ${this.parent.path}/${this.path} does not exists.`
			);
		}
	}

	/**
	 * Denotes if the validator should be considered as empty
	 * @returns {boolean}
	 */
	public isEmpty(): boolean {
		return (
			typeof this.content !== 'string' || this.content.trim().length === 0
		);
	}
}
