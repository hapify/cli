import { Container } from 'typedi';
import { ISerializable, IStorable } from '../interface/Storage';
import { IModel } from '../interface/Generator';
import { Model } from './Model';
import { ModelsApiStorageService } from '../service/storage/api/Models';

export class ModelsCollection implements IStorable, ISerializable<IModel[], Model[]> {
	/** @type {Model[]} The list of model instances */
	private models: Model[];
	/** @type {string} The pseudo path */
	public path: string;
	/** The loaded instances */
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
		const modelsCollection = ModelsCollection.instances.find((m) => m.path === path);
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
		this.fromObject(await this.storageService.forProject(this.project));
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		const models = await this.storageService.set(this.project, this.toObject());
		this.fromObject(models);
	}

	/** Add one or more object to the stack */
	public async add(object: IModel | IModel[]): Promise<void> {
		if (object instanceof Array) {
			for (const o of object) {
				await this.add(o);
			}
		} else {
			this.models.push(new Model(object));
		}
	}
	/** Upsert one or more object to the stack */
	public async update(object: IModel | IModel[]): Promise<void> {
		if (object instanceof Array) {
			for (const o of object) {
				await this.update(o);
			}
		} else {
			await this.remove(object);
			await this.add(object);
		}
	}
	/** Remove an existing object */
	public async remove(object: IModel | IModel[]): Promise<void> {
		if (object instanceof Array) {
			for (const o of object) {
				await this.remove(o);
			}
		} else {
			this.models = this.models.filter((i) => i.id === object.id);
		}
	}

	/**
	 * Find a instance with its id
	 * @param {string} id
	 * @returns {Promise<Model|null>}
	 */
	async find(id: string): Promise<Model | null> {
		return this.models.find((instance) => instance.id === id);
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
		this.models = object.map((m) => new Model(m));
		return this.models;
	}

	/** @inheritDoc */
	public toObject(): IModel[] {
		return this.models.map((m) => m.toObject());
	}

	/**
	 * Returns a pseudo path
	 * @returns {string}
	 */
	private static path(project: string): string {
		return `project:${project}`;
	}
}
