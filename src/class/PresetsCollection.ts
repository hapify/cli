import { IModel, IPreset, ISerializable } from '../interface';
import { Preset } from './';
import { ApiService, IApiModel, IApiPreset } from '../service';
import { Container } from 'typedi';
import { ConfigRemote } from '../config';

export class PresetsCollection implements ISerializable<IPreset[], Preset[]> {
	/** @type {Preset[]} The list of preset instances */
	private presets: Preset[] = [];
	/** @type {Model[]} Remote API service */
	private apiService: ApiService;
	/** @type {string} The loaded instance */
	private static instance: PresetsCollection;

	/** Constructor */
	private constructor() {
		this.apiService = Container.get(ApiService);
	}

	/** Returns a singleton for this config */
	public static async getInstance() {
		if (!PresetsCollection.instance) {
			// Create and load a new collection
			PresetsCollection.instance = new PresetsCollection();
			await PresetsCollection.instance.load();
		}
		return PresetsCollection.instance;
	}

	/**
	 * Load the presets
	 * @return {Promise<void>}
	 */
	private async load(): Promise<void> {
		const presets = await this.apiService
			.get('preset', {
				_page: 0,
				_limit: ConfigRemote.presetsLimit
			})
			.then(response => {
				return (<IApiPreset[]>response.data.items).map(
					(p: IApiPreset): IPreset => ({
						id: p._id,
						name: p.name,
						name__fr: p.name__fr,
						description: p.description,
						description__fr: p.description__fr,
						icon: p.icon,
						models: p.models.map(
							(m: IApiModel): IModel => ({
								id: m._id,
								name: m.name,
								fields: m.fields,
								accesses: m.accesses
							})
						)
					})
				);
			});

		this.fromObject(presets);
	}

	/**
	 * Returns the list of presets
	 * @returns {Promise<Preset[]>}
	 */
	async list(): Promise<Preset[]> {
		return this.presets;
	}

	/**
	 * Returns one preset
	 * @returns {Promise<Preset>}
	 */
	async get(id: string): Promise<Preset> {
		return this.presets.find(p => p.id === id);
	}

	/** @inheritDoc */
	public fromObject(object: IPreset[]): Preset[] {
		this.presets = object.map(p => new Preset(p));
		return this.presets;
	}

	/** @inheritDoc */
	public toObject(): IPreset[] {
		return this.presets.map((preset: Preset): IPreset => preset.toObject());
	}

	/**
	 * Returns a pseudo path
	 * @returns {string}
	 */
	private static path(): string {
		return `preset`;
	}
}
