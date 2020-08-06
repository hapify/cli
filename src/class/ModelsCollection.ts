import { Container } from 'typedi';
import { ISerializable, IStorable } from '../interface/Storage';
import { IModel } from '../interface/Generator';
import { Model } from './Model';
import { ModelsApiStorageService } from '../service/storage/api/Models';

export class ModelsCollection implements IStorable, ISerializable<IModel[], Model[]> {
	/** The list of model instances */
	private models: Model[];
	/** The pseudo path */
	public path: string;
	/** The loaded instances */
	private static instances: ModelsCollection[] = [];
	/** Presets storage */
	private storageService: ModelsApiStorageService;

	private constructor(public project: string) {
		this.storageService = Container.get(ModelsApiStorageService);
		this.path = ModelsCollection.path(project);
	}

	/** Returns a singleton for this config */
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

	public async load(): Promise<void> {
		this.fromObject(await this.storageService.forProject(this.project));
	}

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

	/** Find a instance with its id */
	async find(id: string): Promise<Model | null> {
		return this.models.find((instance) => instance.id === id);
	}

	/** Returns the list of models */
	async list(): Promise<Model[]> {
		return this.models;
	}

	public fromObject(object: IModel[]): Model[] {
		this.models = object.map((m) => new Model(m));
		return this.models;
	}

	public toObject(): IModel[] {
		return this.models.map((m) => m.toObject());
	}

	/** Returns a pseudo path */
	private static path(project: string): string {
		return `project:${project}`;
	}
}
