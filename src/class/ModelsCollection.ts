import { IModel, IStorable, ISerializable } from '../interface';
import { Model } from './';
import { Container } from 'typedi';
import { ModelsApiStorageService } from '../service';

export class ModelsCollection
	implements IStorable, ISerializable<IModel[], Model[]> {
	/** @type {Model[]} The list of model instances */
	private models: Model[];
	/** @type {string} The pseudo path */
	public path: string;
	/** @type {string} The loaded instances */
	private static instances: ModelsCollection[] = [];
	/** Presets storage */
	private storageService: ModelsApiStorageService;

	/**
	 * Constructor
	 * @param {string} project
	 */
	private constructor(public project: string) {
		this.storageService = Container.get(ModelsApiStorageService);
		this.path = ModelsCollection.path(project);
	}

	/**
	 * Returns a singleton for this config
	 * @param {string} project
	 */
	public static async getInstance(project: string) {
		const path = ModelsCollection.path(project);
		// Try to find an existing collection
		const modelsCollection = ModelsCollection.instances.find(
			m => m.path === path
		);
		if (modelsCollection) {
			return modelsCollection;
		}
		// Create and load a new collection
		const collection = new ModelsCollection(project);
		await collection.load();
		// Keep the collection
		ModelsCollection.instances.push(collection);

		return collection;
	}

	/** @inheritDoc */
	public async load(): Promise<void> {
		this.fromObject(await this.storageService.list(this.project));
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		await this.storageService.set(
			this.project,
			this.models.map(m => m.toObject())
		);
	}

	/**
	 * Find a instance with its id
	 * @param {string} id
	 * @returns {Promise<Model|null>}
	 */
	async find(id: string): Promise<Model | null> {
		return this.models.find(instance => instance.id === id);
	}

	/**
	 * Returns the list of models
	 * @returns {Promise<Model[]>}
	 */
	async list(): Promise<Model[]> {
		return this.models;
	}

	/** @inheritDoc */
	public fromObject(object: IModel[]): Model[] {
		this.models = object.map(m => new Model(m));
		return this.models;
	}

	/** @inheritDoc */
	public toObject(): IModel[] {
		return this.models.map(m => m.toObject());
	}

	/**
	 * Returns a pseudo path
	 * @returns {string}
	 */
	private static path(project: string): string {
		return `project:${project}`;
	}
}
