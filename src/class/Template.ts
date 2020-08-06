import { Container } from 'typedi';
import { ISerializable, IStorable } from '../interface/Storage';
import { Engine, Input, IStringVariants, ITemplate } from '../interface/Generator';
import { IConfigTemplate } from '../interface/Config';
import { TemplatesFileStorageService } from '../service/storage/file/Template';
import { Channel } from './Channel';
import { StringService } from '../service/String';

export class Template implements IStorable, ISerializable<ITemplate, Template>, ITemplate {
	/** @type {string} */
	private static defaultFolder = 'model';
	/** Template storage */
	private storageService: TemplatesFileStorageService;
	/** @type {string} The template's path */
	path: string;
	/** @type {string} The template's type */
	engine: Engine;
	/** @type {string} Denotes if the template has to to be ran for one or all models */
	input: Input;
	/** @type {string} The template's path */
	contentPath: string;
	/** @type {string} The template's content */
	content: string;

	/** Constructor */
	constructor(private parent: Channel, object?: ITemplate) {
		this.storageService = Container.get(TemplatesFileStorageService);
		if (object) {
			this.fromObject(object);
		}
	}

	/** @inheritDoc */
	public fromObject(object: ITemplate): Template {
		this.path = object.path;
		this.engine = object.engine;
		this.input = object.input;
		this.content = object.content;
		this.contentPath = Template.computeContentPath(this);
		return this;
	}

	/** @inheritDoc */
	public toObject(): ITemplate {
		return {
			path: this.path,
			engine: this.engine,
			input: this.input,
			content: this.content,
		};
	}

	/**
	 * Denotes if the template should be considered as empty
	 * @returns {boolean}
	 */
	public isEmpty(): boolean {
		return typeof this.content !== 'string' || this.content.trim().length === 0;
	}

	/**
	 * Denotes if the template needs a specific model to be generated
	 * @returns {boolean}
	 */
	public needsModel(): boolean {
		return this.input === 'one';
	}

	/**
	 * Get the extension of the input file
	 * @returns {string}
	 */
	public extension(): string {
		return Template.computeExtension(this);
	}

	/**
	 * Get the parent channel
	 * @returns {Channel}
	 */
	public channel(): Channel {
		return this.parent;
	}

	/** @inheritDoc */
	public async load(): Promise<void> {
		await this.validate();
		this.content = await this.storageService.get([this.parent.templatesPath, this.contentPath]);
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		await this.storageService.set([this.parent.templatesPath, this.contentPath], this.content);
	}

	/**
	 * Check resource validity
	 * @throws {Error}
	 */
	private async validate(): Promise<void> {
		if (!(await this.storageService.exists([this.parent.templatesPath, this.contentPath]))) {
			throw new Error(`Template's path ${this.parent.templatesPath}/${this.contentPath} does not exists.`);
		}
	}

	/**
	 * Compute the content path from the dynamic path
	 * @param {Template|IConfigTemplate} template
	 * @return {string}
	 */
	static computeContentPath(template: Template | IConfigTemplate): string {
		// Get string service
		const stringService: StringService = Container.get(StringService);

		const variants = stringService.variants(Template.defaultFolder);
		const keys = Object.keys(variants) as (keyof IStringVariants)[];
		let path = template.path;
		for (const key of keys) {
			path = path.replace(new RegExp(`{${key}}`, 'g'), variants[key]);
		}

		return `${path}.${Template.computeExtension(template)}`;
	}

	/**
	 * Compute the extension of the template
	 * @param {Template|IConfigTemplate} template
	 * @return {string}
	 */
	private static computeExtension(template: Template | IConfigTemplate): string {
		if (template.engine === 'hpf') {
			return 'hpf';
		}
		return 'js';
	}
}
