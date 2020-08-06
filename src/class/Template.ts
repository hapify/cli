import { Container } from 'typedi';
import { ISerializable, IStorable } from '../interface/Storage';
import { Engine, Input, IStringVariants, ITemplate } from '../interface/Generator';
import { IConfigTemplate } from '../interface/Config';
import { TemplatesFileStorageService } from '../service/storage/file/Template';
import { Channel } from './Channel';
import { StringService } from '../service/String';

export class Template implements IStorable, ISerializable<ITemplate, Template>, ITemplate {
	private static defaultFolder = 'model';
	/** Template storage */
	private storageService: TemplatesFileStorageService;
	/** The template's path */
	path: string;
	/** The template's type */
	engine: Engine;
	/** Denotes if the template has to to be ran for one or all models */
	input: Input;
	/** The template's path */
	contentPath: string;
	/** The template's content */
	content: string;

	constructor(private parent: Channel, object?: ITemplate) {
		this.storageService = Container.get(TemplatesFileStorageService);
		if (object) {
			this.fromObject(object);
		}
	}

	public fromObject(object: ITemplate): Template {
		this.path = object.path;
		this.engine = object.engine;
		this.input = object.input;
		this.content = object.content;
		this.contentPath = Template.computeContentPath(this);
		return this;
	}

	public toObject(): ITemplate {
		return {
			path: this.path,
			engine: this.engine,
			input: this.input,
			content: this.content,
		};
	}

	/** Denotes if the template should be considered as empty */
	public isEmpty(): boolean {
		return typeof this.content !== 'string' || this.content.trim().length === 0;
	}

	/** Denotes if the template needs a specific model to be generated */
	public needsModel(): boolean {
		return this.input === 'one';
	}

	/** Get the extension of the input file */
	public extension(): string {
		return Template.computeExtension(this);
	}

	/** Get the parent channel */
	public channel(): Channel {
		return this.parent;
	}

	public async load(): Promise<void> {
		await this.validate();
		this.content = await this.storageService.get([this.parent.templatesPath, this.contentPath]);
	}

	async save(): Promise<void> {
		await this.storageService.set([this.parent.templatesPath, this.contentPath], this.content);
	}

	/** Check resource validity */
	private async validate(): Promise<void> {
		if (!(await this.storageService.exists([this.parent.templatesPath, this.contentPath]))) {
			throw new Error(`Template's path ${this.parent.templatesPath}/${this.contentPath} does not exists.`);
		}
	}

	/** Compute the content path from the dynamic path */
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

	/** Compute the extension of the template */
	private static computeExtension(template: Template | IConfigTemplate): string {
		if (template.engine === 'hpf') {
			return 'hpf';
		}
		return 'js';
	}
}
