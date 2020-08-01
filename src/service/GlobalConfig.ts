import { Service } from 'typedi';
import * as Path from 'path';
import * as Fs from 'fs';
import * as Os from 'os';
import mkdirp from 'mkdirp';
import * as Joi from 'joi';
import { IGlobalConfig } from '../interface/IGlobalConfig';
import { GlobalConfigSchema } from '../interface/schema/GlobalConfig';

@Service()
export class GlobalConfigService {
	/** Define the config root path */
	private rootPath = Path.resolve(Os.homedir(), '.hapify');
	/** The config file name */
	private filename = 'config.json';
	/** The config file path */
	private filePath = Path.join(this.rootPath, this.filename);
	/** Store the config data */
	private data: IGlobalConfig = {};

	/** Constructor */
	constructor() {
		this.init();
	}

	/** Create file if not exists */
	private init(): void {
		// Create path
		if (!Fs.existsSync(this.rootPath) || !Fs.statSync(this.rootPath).isDirectory()) {
			mkdirp.sync(this.rootPath);
		}
		// Create file
		if (!Fs.existsSync(this.filePath) || !Fs.statSync(this.filePath).isFile()) {
			this.save();
		}
		// Load & validate config
		this.load();
		this.validate();
	}

	/** Save data to config file */
	private save(): void {
		Fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4), 'utf8');
	}

	/** Load data from config file */
	private load(): void {
		this.data = JSON.parse(<string>Fs.readFileSync(this.filePath, 'utf8'));
	}

	/** Validate the current config or scream */
	private validate(data: IGlobalConfig = this.data): void {
		const validation = Joi.validate(data, GlobalConfigSchema);
		if (validation.error) {
			const errorMessage = validation.error.details
				.map((v) => {
					if (v.context.key === 'apiKey') {
						return `${v.message}. Please visit https://www.hapify.io/my-key`;
					}
					return v.message;
				})
				.join(', ');
			throw new Error(`Global config format error: ${errorMessage}.`);
		}
	}

	/** Returns the configs */
	getData(): IGlobalConfig {
		return this.data;
	}

	/** Validate and save the configs */
	setData(data: IGlobalConfig): void {
		this.validate(data);
		this.data = data;
		this.save();
	}
}
