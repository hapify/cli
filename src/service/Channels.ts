import { Service } from 'typedi';
import * as Path from 'path';
import { OptionsService } from './Options';
import * as Fs from 'fs';
import * as Hoek from 'hoek';
import { ModelsCollection, Channel } from '../class';

@Service()
export class ChannelsService {
	/** @type {Channel[]} Channels instances */
	private _channels: Channel[];

	/**
	 * Constructor
	 * @param optionsService
	 */
	constructor(private optionsService: OptionsService) {}

	/**
	 * Get the channels. Load them if not loaded yet
	 * @return {Channel[]}
	 * @throws {Error}
	 */
	public async channels(): Promise<Channel[]> {
		if (!(this._channels instanceof Array)) {
			this._channels = await ChannelsService.sniff(
				this.optionsService.dir(),
				this.optionsService.depth()
			);
			if (this._channels.length === 0) {
				throw new Error('No channel found');
			}
			for (const channel of this._channels) {
				await channel.load();
			}
		}
		return this._channels;
	}

	/**
	 * Ensure that all channels refers to the same project
	 * @throws {Error}
	 */
	public async ensureSameProject(): Promise<void> {
		const channels = await this.channels();
		const firstProject = channels[0].config.project;
		for (const channel of channels) {
			if (channel.config.project !== firstProject) {
				throw new Error('Channels must refer to the same project');
			}
		}
	}

	/**
	 * Ensure that all channels define the same default fields
	 * @throws {Error}
	 */
	public async ensureSameDefaultFields(): Promise<void> {
		// Get defined fields
		const channels = await this.channels();
		const fieldsGroup = channels
			.filter(c => !!c.config.defaultFields)
			.map(c => c.config.defaultFields);
		if (fieldsGroup.length < 2) {
			return;
		}
		// Compare each fields group to the first one
		const ref = fieldsGroup[0];
		for (let i = 1; i < fieldsGroup.length; i++) {
			if (!Hoek.deepEqual(ref, fieldsGroup[i])) {
				throw new Error(
					'Default fields must match for all channels if defined'
				);
			}
		}
	}

	/**
	 * Change project in all found channels from a given or current dir
	 * Returns modified channels
	 * Defined path for a specific channel
	 */
	public async changeProject(project: string, path?: string): Promise<void> {
		if (path) {
			await Channel.changeProject(path, project);
		}
		// Try to find channels
		else {
			const channels = await ChannelsService.sniff(
				this.optionsService.dir(),
				this.optionsService.depth()
			);
			if (channels.length === 0) {
				throw new Error('No channel found');
			}
			for (const channel of channels) {
				await Channel.changeProject(channel.path, project);
			}
		}
	}

	/**
	 * Returns the first models collection
	 * @return {ModelsCollection}
	 * @throws {Error}
	 */
	public async modelsCollection(): Promise<ModelsCollection> {
		const channels = await this.channels();
		return channels[0].modelsCollection;
	}

	/**
	 * This method detect all channels in the directory and its sub-directories, and create instances for them.
	 * We can define the depth level of subdirectories.
	 * @param {string} path
	 * @param {number} depth  Default: 2
	 * @param {number} from  Default: path
	 * @return {Channel[]}
	 */
	private static async sniff(
		path: string,
		depth: number = 2,
		from: string = path
	): Promise<Channel[]> {
		// Get channels in sub-directories first
		const channels: Channel[] =
			depth <= 0
				? []
				: (await Promise.all(
						Fs.readdirSync(path)
							.map(dir => Path.join(path, dir))
							.filter(subPath =>
								Fs.statSync(subPath).isDirectory()
							)
							.map(subPath =>
								ChannelsService.sniff(subPath, depth - 1, from)
							)
				  )).reduce(
						(flatten: Channel[], channels: Channel[]) =>
							flatten.concat(channels),
						[]
				  );

		// Get channel of current directory if exists
		if (await Channel.configExists(path)) {
			const name = Path.relative(Path.dirname(from), path);
			const channel = new Channel(path, name);
			channels.push(channel);
		}

		return channels;
	}
}
