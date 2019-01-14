import { IModel, IStorable, ISerilizable } from '../interface';
import { Model, SingleSave } from './';
import { ApiService, IApiModel } from '../service';
import { Container } from 'typedi';

export class ModelsCollection extends SingleSave implements IStorable, ISerilizable<IModel[], Model[]> {

  /** @type {Model[]} The list of model instances */
  private models: Model[];
  /** @type {Model[]} Remote API service */
  private apiService: ApiService;
  /** @type {string} The pseudo path */
  public path: string;
  /** @type {string} The loaded instances */
  private static instances: ModelsCollection[] = [];
  /** @type {string} The loaded instances */
  private hashes: { [id: string]: string } = {};

  /**
   * Constructor
   * @param {string} project
   */
  private constructor(public project: string) {
    super();
    this.apiService = Container.get(ApiService);
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
    const models = await this.apiService.get('model', {
      _page: 0,
      _limit: 100,
      project: this.project
    })
      .then(response => {
        return (<IApiModel[]>response.data.items)
          .map((m: IApiModel): IModel => ({
            id: m._id,
            name: m.name,
            fields: m.fields,
            accesses: m.accesses,
          }));
      });

    this.fromObject(models);
    this.updateHashes();
  }

  /** @inheritDoc */
  async save(): Promise<void> {

    // Get models to create
    const toCreate = this.models.filter(m => typeof this.hashes[m.id] === 'undefined');

    // Create models and update id
    for (const model of toCreate) {
      const response = await this.apiService.post('model', {
        project: this.project,
        name: model.name,
        fields: model.fields,
        accesses: model.accesses,
      });
      model.id = response.data._id;
    }

    // Get models to update
    const toUpdate = this.models.filter(m => typeof this.hashes[m.id] === 'string' && this.hashes[m.id] !== m.hash());

    // Update models
    for (const model of toUpdate) {
      await this.apiService.patch(`model/${model.id}`, {
        name: model.name,
        fields: model.fields,
        accesses: model.accesses,
      });
    }

    // Get models to delete
    const toDelete = Object.keys(this.hashes).filter(id => !this.models.some(m => m.id === id));

    // Delete models
    for (const id of toDelete) {
      await this.apiService.delete(`model/${id}`);
    }

    this.updateHashes();
  }

  /** Update hashes from models */
  private updateHashes() {
    this.hashes = {};
    for (const model of this.models) {
      this.hashes[model.id] = model.hash();
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
    this.models = object.map((model: IModel): Model => {
      const m = new Model();
      return m.fromObject(model);
    });
    return this.models;
  }

  /** @inheritDoc */
  public toObject(): IModel[] {
    return this.models.map((model: Model): IModel => model.toObject());
  }

  /**
   * Returns a pseudo path
   * @returns {string}
   */
  private static path(project: string): string {
    return `project:${project}`;
  }
}
