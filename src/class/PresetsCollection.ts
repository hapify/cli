import { IPreset, ISerializable, IStorable } from '../interface';
import { Preset } from './';
import { PresetsStorageService } from '../service';
import { Container } from 'typedi';

export class PresetsCollection
	implements IStorable, ISerializable<IPreset[], Preset[]> {
	/** @type {Preset[]} The list of preset instances */
	private presets: Preset[] = [];
	/** Presets storage */
	private presetsStorageService: PresetsStorageService;
	/** @type {string} The loaded instance */
	private static instance: PresetsCollection;

	/** Constructor */
	private constructor() {
		this.presetsStorageService = Container.get(PresetsStorageService);
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
	async load(): Promise<void> {
		this.fromObject(await this.presetsStorageService.list());
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		// Nothing to save
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
		return this.presets.map(p => p.toObject());
	}
}
