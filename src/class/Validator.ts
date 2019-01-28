import * as Fs from 'fs';
import { IStorable } from '../interface';
import { Channel, SingleSave } from './';

export class Validator extends SingleSave implements IStorable {
	/** @type {string} The validator's script content */
	content: string;

	/**
	 * Constructor
	 * @param {Channel} parent
	 * @param {string} path
	 */
	constructor(private parent: Channel, public path: string) {
		super();
	}

	/** @inheritDoc */
	public async load(): Promise<void> {
		const contentPath = `${this.parent.path}/${this.path}`;
		this.content = <string>Fs.readFileSync(contentPath, 'utf8');
		this.didLoad(this.content);
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		// Leave early
		if (this.shouldSave(this.content)) {
			const contentPath = `${this.parent.path}/${this.path}`;
			Fs.writeFileSync(contentPath, this.content, 'utf8');
		}
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
