import * as Path from 'path';
import {
	IChannel,
	IConfig,
	ISerializable,
	IStorable,
	ConfigSchema,
	TransformValidationMessage
} from '../interface';
import { ModelsCollection, Project, Template, Validator } from './';
import { TemplateEngine, TemplateInput } from '../enum';
import md5 from 'md5';
import * as Joi from 'joi';
import { FieldType } from './FieldType';
import { Container } from 'typedi';
import { ChannelFileStorageService } from '../service';

export class Channel implements IStorable, ISerializable<IChannel, Channel> {
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
	/** @type {Project} Current project */
	public project: Project;
	/** @type {ModelsCollection} List of models container */
	public modelsCollection: ModelsCollection;
	/** @type {string} */
	public templatesPath: string;
	/** Channel storage */
	private storageService: ChannelFileStorageService;

	/**
	 * Constructor
	 * @param {string} path
	 * @param {string|null} name
	 */
	constructor(public path: string, name: string = null) {
		this.storageService = Container.get(ChannelFileStorageService);
		this.name = name ? name : Path.basename(path);
		this.id = md5(this.path);
		this.templatesPath = Path.join(this.path, Channel.defaultFolder);
	}

	/** @inheritDoc */
	async load(): Promise<void> {
		// Validate storage
		await this.validate();

		// Get config from storage
		const config = await this.storageService.get([
			this.path,
			Channel.configFile
		]);

		// Validate the incoming config
		const validation = Joi.validate(config, ConfigSchema);
		if (validation.error) {
			// Transform Joi message
			TransformValidationMessage(validation.error);
			throw validation.error;
		}

		// Apply configuration
		this.config = config;

		// Override default name if given
		if (this.config.name) {
			this.name = this.config.name;
		}

		// Load project
		this.project = await Project.getInstance(this.config.project);

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

		// Save project (no effect)
		await this.project.save();

		// Update configurations
		this.config.templates = this.templates.map(m => {
			const t = m.toObject();
			delete t.content;
			return t;
		});
		this.config.validatorPath = this.validator.path;

		// Write file if necessary
		await this.storageService.set(
			[this.path, Channel.configFile],
			this.config
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
	 * Check resource validity
	 * @throws {Error}
	 */
	private async validate(): Promise<void> {
		if (
			!(await this.storageService.exists([this.path, Channel.configFile]))
		) {
			throw new Error(
				`Channel config's path ${this.path}/${
					Channel.configFile
				} does not exists.`
			);
		}
	}
	/** Denotes if the config file exists */
	public static async configExists(path: string): Promise<boolean> {
		return await Container.get(ChannelFileStorageService).exists([
			path,
			Channel.configFile
		]);
	}
	/** Init a Hapify structure within a directory */
	public static async create(path: string): Promise<void> {
		if (await Channel.configExists(path)) {
			throw new Error(`A channel already exists in this directory.`);
		}

		// Create a channel from scratch
		const channel = new Channel(path);
		channel.config = {
			validatorPath: `${Channel.defaultFolder}/validator.js`,
			name: channel.name,
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

		// Create template
		const template = new Template(
			channel,
			Object.assign(channel.config.templates[0], {
				content: '// Hello <<M A>>'
			})
		);
		channel.templates.push(template);

		// Create validator
		channel.validator = new Validator(
			channel,
			channel.config.validatorPath
		);
		channel.validator.content = `// Models validation script\nreturn { errors: [], warnings: [] };`;

		// Save channel
		await channel.save();
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
