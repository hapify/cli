import {
	ITemplate,
	IStorable,
	ISerializable,
	IConfigTemplate
} from '../interface';
import { TemplateInput, TemplateEngine, SentenceFormat } from '../enum';
import { Channel } from './';
import { Container } from 'typedi';
import { TemplatesStorageService, StringService } from '../service';

export class Template
	implements IStorable, ISerializable<ITemplate, Template>, ITemplate {
	/** @type {string} */
	private static defaultFolder = 'model';
	/** Template storage */
	private templatesStorageService: TemplatesStorageService;
	/** @type {string} The template's path */
	path: string;
	/** @type {string} The template's type */
	engine: string;
	/** @type {string} Denotes if the template has to to be ran for one or all models */
	input: string;
	/** @type {string} The template's path */
	contentPath: string;
	/** @type {string} The template's content */
	content: string;

	/** Constructor */
	constructor(private parent: Channel, object?: ITemplate) {
		this.templatesStorageService = Container.get(TemplatesStorageService);
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
			content: this.content
		};
	}

	/**
	 * Denotes if the template should be considered as empty
	 * @returns {boolean}
	 */
	public isEmpty(): boolean {
		return (
			typeof this.content !== 'string' ||
			this.content === null ||
			this.content.trim().length === 0
		);
	}

	/**
	 * Denotes if the template needs a specific model to be generated
	 * @returns {boolean}
	 */
	public needsModel(): boolean {
		return this.input === TemplateInput.One;
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
		this.content = await this.templatesStorageService.get(
			`${this.parent.templatesPath}/${this.contentPath}`
		);
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		await this.templatesStorageService.set(
			`${this.parent.templatesPath}/${this.contentPath}`,
			this.content
		);
	}

	/**
	 * Compute the content path from the dynamic path
	 * @param {Template|IConfigTemplate} template
	 * @return {string}
	 */
	static computeContentPath(template: Template | IConfigTemplate): string {
		// Get string service
		const stringService: StringService = Container.get(StringService);
		// Apply replacements
		const path = template.path
			.replace(
				/{model\.hyphen}/g,
				stringService.format(
					Template.defaultFolder,
					SentenceFormat.SlugHyphen
				)
			)
			.replace(
				/{model\.hyphenUpper}/g,
				stringService.format(
					Template.defaultFolder,
					SentenceFormat.SlugHyphenUpperCase
				)
			)
			.replace(
				/{model\.underscore}/g,
				stringService.format(
					Template.defaultFolder,
					SentenceFormat.SlugUnderscore
				)
			)
			.replace(
				/{model\.underscoreUpper}/g,
				stringService.format(
					Template.defaultFolder,
					SentenceFormat.SlugUnderscoreUpperCase
				)
			)
			.replace(
				/{model\.oneWord}/g,
				stringService.format(
					Template.defaultFolder,
					SentenceFormat.SlugOneWord
				)
			)
			.replace(
				/{model\.upperCamel}/g,
				stringService.format(
					Template.defaultFolder,
					SentenceFormat.UpperCamelCase
				)
			)
			.replace(
				/{model\.lowerCamel}/g,
				stringService.format(
					Template.defaultFolder,
					SentenceFormat.LowerCamelCase
				)
			);

		return `${path}.${Template.computeExtension(template)}`;
	}

	/**
	 * Compute the extension of the template
	 * @param {Template|IConfigTemplate} template
	 * @return {string}
	 */
	private static computeExtension(
		template: Template | IConfigTemplate
	): string {
		if (template.engine === TemplateEngine.Hpf) {
			return 'hpf';
		}
		return 'js';
	}
}
