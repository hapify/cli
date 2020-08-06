import { ISerializable, IStorable } from '../interface/Storage';
import { Container } from 'typedi';
import { IBoilerplate } from '../interface/Objects';
import { Boilerplate } from './Boilerplate';
import { BoilerplatesApiStorageService } from '../service/storage/api/Boilerplates';

export class BoilerplatesCollection implements IStorable, ISerializable<IBoilerplate[], Boilerplate[]> {
	/** @type {Boilerplate[]} The list of boilerplate instances */
	private boilerplates: Boilerplate[] = [];
	/** Boilerplates storage */
	private storageService: BoilerplatesApiStorageService;
	/** @type {string} The loaded instance */
	private static instance: BoilerplatesCollection;

	/** Constructor */
	private constructor() {
		this.storageService = Container.get(BoilerplatesApiStorageService);
	}

	/** Returns a singleton for this config */
	public static async getInstance() {
		if (!BoilerplatesCollection.instance) {
			// Create and load a new collection
			BoilerplatesCollection.instance = new BoilerplatesCollection();
			await BoilerplatesCollection.instance.load();
		}
		return BoilerplatesCollection.instance;
	}

	/**
	 * Load the boilerplates
	 * @return {Promise<void>}
	 */
	async load(): Promise<void> {
		this.fromObject(await this.storageService.list());
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		// Nothing to save
	}

	/**
	 * Returns the list of boilerplates
	 * @returns {Promise<Boilerplate[]>}
	 */
	async list(): Promise<Boilerplate[]> {
		return this.boilerplates;
	}

	/**
	 * Returns one boilerplate
	 * @returns {Promise<Boilerplate>}
	 */
	async get(id: string): Promise<Boilerplate> {
		return this.boilerplates.find((p) => p.id === id);
	}

	/**
	 * Returns one boilerplate by its slug
	 * @returns {Promise<Boilerplate>}
	 */
	async getBySlug(slug: string): Promise<Boilerplate> {
		const data = await this.storageService.list({
			_limit: 1,
			slug,
		});
		return data.length ? new Boilerplate(data[0]) : null;
	}

	/** @inheritDoc */
	public fromObject(object: IBoilerplate[]): Boilerplate[] {
		this.boilerplates = object.map((p) => new Boilerplate(p));
		return this.boilerplates;
	}

	/** @inheritDoc */
	public toObject(): IBoilerplate[] {
		return this.boilerplates.map((p) => p.toObject());
	}
}
