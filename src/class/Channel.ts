import * as Fs from 'fs';
import * as Path from 'path';
import {
	IChannel,
	IConfig,
	ISerializable,
	IStorable,
	ConfigSchema,
	TransformValidationMessage
} from '../interface';
import { ModelsCollection, Template, Validator, SingleSave } from './';
import { TemplateEngine, TemplateInput } from '../enum';
import md5 from 'md5';
import mkdirp from 'mkdirp';
import * as Joi from 'joi';
import { FieldType } from './FieldType';
import { ChannelStorageService } from '../service';

export class Channel extends SingleSave
	implements IStorable, ISerializable<IChannel, Channel> {
	/** @type {string} */
	public name: string;
	/** @type {string} */
	public id: string;
	/** @type {string} */
	private static defaultFolder = 'hapify';
	/** @type {string} */
	private static configFile = 'hapify.json';
	/** @type {IConfig} */
	public config: IConfig;
	/** @type {Template[]} Templates instances */
	public templates: Template[];
	/** @type {Template[]} Templates instances */
	public validator: Validator;
	/** @type {ModelsCollection} List of models container */
	public modelsCollection: ModelsCollection;
	/** @type {string} */
	public templatesPath: string;
	/** Channel storage */
	private storageService: ChannelStorageService;

	/**
	 * Constructor
	 * @param {string} path
	 * @param {string|null} name
	 */
	constructor(public path: string, name: string = null) {
		super();
		this.name = name ? name : Path.basename(path);
		this.id = md5(this.path);
		this.templatesPath = Path.join(this.path, Channel.defaultFolder);
		this.validate();
	}

	/** @inheritDoc */
	async load(): Promise<void> {
		// Get config from storage
		const data = await this.storageService.get([
			this.path,
			Channel.configFile
		]);
		this.config = JSON.parse(data);

		// Override default name if given
		if (this.config.name) {
			this.name = this.config.name;
		}

		// Load each content file
		this.templates = [];
		for (let i = 0; i < this.config.templates.length; i++) {
			const template = new Template(
				this,
				Object.assign(this.config.templates[i], { content: '' })
			);
			await template.load();
			this.templates.push(template);
		}

		// Load models
		this.modelsCollection = await ModelsCollection.getInstance(
			this.config.project
		);

		// Load validator
		this.validator = new Validator(this, this.config.validatorPath);
		await this.validator.load();
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		// Saves subs instances
		for (const template of this.templates) {
			await template.save();
		}
		await this.validator.save();

		// Update configurations
		this.config.templates = this.templates.map((m: Template) => {
			const t = m.toObject();
			delete t.content;
			return t;
		});
		this.config.validatorPath = this.validator.path;

		// Write file if necessary
		await this.storageService.set(
			[this.path, Channel.configFile],
			JSON.stringify(this.config, null, 2)
		);

		// Cleanup files in template path
		const legitFiles = this.templates.map(t => [
			this.templatesPath,
			t.contentPath
		]);
		legitFiles.push([this.path, this.config.validatorPath]);
		await this.storageService.cleanup(
			[this.path, Channel.defaultFolder],
			legitFiles
		);
	}

	/**
	 * Denotes if the template should be considered as empty
	 * @returns {boolean}
	 */
	isEmpty(): boolean {
		const validatorIsEmpty = this.validator.isEmpty();
		const templatesAreEmpty = this.templates.every(t => t.isEmpty());
		return validatorIsEmpty && templatesAreEmpty;
	}

	/**
	 * Remove empty templates
	 * @returns {void}
	 */
	filter(): void {
		this.templates = this.templates.filter(t => !t.isEmpty());
	}

	/**
	 * Denotes if the config file exists and its templates
	 * If something is not valid, it throws an error.
	 * @throws {Error}
	 */
	private validate(): void {
		const path = Path.join(this.path, Channel.configFile);
		if (!Fs.existsSync(path)) {
			throw new Error(`Channel config's path ${path} does not exists.`);
		}

		let config: IConfig;
		try {
			config = JSON.parse(<string>Fs.readFileSync(path, 'utf8'));
		} catch (error) {
			throw new Error(
				`An error occurred while reading Channel config's at ${path}: ${error.toString()}`
			);
		}

		// Validate the incoming config
		const validation = Joi.validate(config, ConfigSchema);
		if (validation.error) {
			// Transform Joi message
			TransformValidationMessage(validation.error);
			throw validation.error;
		}

		for (const template of config.templates) {
			const contentPath = Path.join(
				this.templatesPath,
				Template.computeContentPath(template)
			);
			if (!Fs.existsSync(contentPath)) {
				throw new Error(
					`Channel template's path ${contentPath} does not exists.`
				);
			}
		}

		const validatorPath = Path.join(this.path, config.validatorPath);
		if (!Fs.existsSync(validatorPath)) {
			throw new Error(
				`Channel validator's path ${validatorPath} does not exists.`
			);
		}
	}

	/**
	 * Denotes if the config file exists
	 * @param {string} path
	 * @return {boolean}
	 */
	public static configExists(path: string): boolean {
		const configPath = Path.join(path, Channel.configFile);
		return Fs.existsSync(configPath);
	}

	/**
	 * Init a Hapify structure within a directory
	 * @param {string} path
	 * @return {Promise<void>}
	 */
	public static async create(path: string): Promise<void> {
		if (!Fs.existsSync(path)) {
			throw new Error(`Channel's path ${path} does not exists.`);
		}
		const configPath = Path.join(path, Channel.configFile);
		if (Fs.existsSync(configPath)) {
			throw new Error(`A channel already exists in this directory.`);
		}
		const config: IConfig = {
			validatorPath: `${Channel.defaultFolder}/validator.js`,
			name: 'New channel',
			description: 'A brand new channel',
			project: 'projectId',
			defaultFields: [
				{
					name: 'Id',
					type: FieldType.String,
					subtype: null,
					reference: null,
					primary: true,
					unique: false,
					label: false,
					nullable: false,
					multiple: false,
					important: false,
					searchable: false,
					sortable: false,
					isPrivate: false,
					internal: true,
					restricted: false,
					ownership: true
				}
			],
			templates: [
				{
					path: 'models/{model.hyphen}/hello.js',
					engine: TemplateEngine.Hpf,
					input: TemplateInput.One
				}
			]
		};

		// Create dir
		mkdirp.sync(Path.join(path, Channel.defaultFolder, 'models', 'model'));

		// Dump config file
		const configData = JSON.stringify(config, null, 2);
		Fs.writeFileSync(configPath, configData, 'utf8');

		// Create template file
		const templateContent = `// Hello <<M A>>`;
		const templatePath = Path.join(
			path,
			Channel.defaultFolder,
			'models',
			'model',
			'hello.js.hpf'
		);
		Fs.writeFileSync(templatePath, templateContent, 'utf8');

		// Create validator file
		const validatorContent = `// Models validation script\nreturn { errors: [], warnings: [] };`;
		const validatorPath = Path.join(
			path,
			Channel.defaultFolder,
			'validator.js'
		);
		Fs.writeFileSync(validatorPath, validatorContent, 'utf8');
	}

	/** @inheritDoc */
	public fromObject(object: IChannel): Channel {
		// Do not update name nor id
		// Create or update templates if necessary
		// By keeping the same instances, we will avoid a file saving if the content did not change
		this.templates = object.templates.map(t => {
			// Try to find an existing template
			const existing = this.templates.find(e => e.path === t.path);
			if (existing) {
				return existing.fromObject(t);
			}
			// Otherwise create a new template
			return new Template(this, t);
		});

		// Update validator
		this.validator.content = object.validator;

		return this;
	}

	/** @inheritDoc */
	public toObject(): IChannel {
		return {
			id: this.id,
			name: this.name,
			description: this.config.description || null,
			logo: this.config.logo || null,
			templates: this.templates.map((template: Template) =>
				template.toObject()
			),
			validator: this.validator.content
		};
	}
}
