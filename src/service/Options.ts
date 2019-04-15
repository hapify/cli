import { Service } from 'typedi';
import { Command, CommanderStatic } from 'commander';
import * as Path from 'path';
import { GlobalConfigService } from './GlobalConfig';
import { IRemoteConfig } from '../interface';
import { RemoteConfig } from '../config';

@Service()
export class OptionsService {
	/** @type {commander.CommanderStatic} program */
	private program: CommanderStatic;
	/** @type {commander.CommanderStatic} program */
	private command: Command;

	/** Constructor */
	constructor(private globalConfigService: GlobalConfigService) {}

	/**
	 * Set program entity
	 * @param {commander.CommanderStatic} program
	 */
	setProgram(program: CommanderStatic): void {
		this.program = program;
	}

	/**
	 * Set command entity
	 * @param {commander.Command} command
	 */
	setCommand(command: Command): void {
		this.command = command;
	}

	/** Returns the remote config and override defaults with global config (if any) */
	remoteConfig(): IRemoteConfig {
		const configs = Object.assign({}, RemoteConfig);
		configs.uri = this.apiUrl();
		return configs;
	}

	/** @return {string} Return the working directory computed with the --dir option */
	dir(): string {
		if (this.program.dir) {
			if (Path.isAbsolute(this.program.dir)) {
				return this.program.dir;
			}
			return Path.resolve(process.cwd(), this.program.dir);
		}
		return process.cwd();
	}

	/** @return {string} Return the API Key to use (explicit or global) */
	apiKey(): string {
		const key =
			this.program.key || this.globalConfigService.getData().apiKey;
		if (!key) {
			throw new Error(
				'Please define an API Key using command "hpf key" or the option "--key".\nTo get your api key, please visit https://www.hapify.io/my-key'
			);
		}
		return key;
	}

	/** @return {string} Return the API URL to use or default URL */
	apiUrl(): string {
		const url = this.globalConfigService.getData().apiUrl;
		return url || RemoteConfig.uri;
	}

	/** @return {boolean} Denotes if the debug mode is enabled */
	debug(): boolean {
		return !!this.program.debug;
	}

	/** @return {number} Get the depth for recursive search */
	depth(): number {
		return this.command.depth;
	}

	/** @return {string} Get the output file path */
	output(): string {
		return this.command.output;
	}

	/** @return {number} Get the required http port */
	port(): number {
		return this.command.port;
	}

	/** @return {string} Get the required http hostname */
	hostname(): string {
		return this.command.hostname;
	}

	/** @return {boolean} Denotes if a new tab should be opened */
	open(): boolean {
		return !!this.command.open;
	}
}
