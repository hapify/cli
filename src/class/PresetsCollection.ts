import { IModel, IPreset, ISerilizable } from '../interface';
import { Preset } from './';
import { ApiService, IApiModel, IApiPreset } from '../service';
import { Container } from 'typedi';

export class PresetsCollection implements ISerilizable<IPreset[], Preset[]> {

  /** @type {Preset[]} The list of preset instances */
  private presets: Preset[] = [];
  /** @type {Model[]} Remote API service */
  private apiService: ApiService;
  /** @type {string} The pseudo path */
  public path: string;
  /** @type {string} The loaded instances */
  private static instances: PresetsCollection[] = [];

  /** Constructor */
  private constructor() {
    this.apiService = Container.get(ApiService);
    this.path = PresetsCollection.path();
  }

  /** Returns a singleton for this config */
  public static async getInstance() {
    const path = PresetsCollection.path();
    // Try to find an existing collection
    const presetsCollection = PresetsCollection.instances.find((m) => m.path === path);
    if (presetsCollection) {
      return presetsCollection;
    }
    // Create and load a new collection
    const collection = new PresetsCollection();
    await collection.load();
    // Keep the collection
    PresetsCollection.instances.push(collection);

    return collection;
  }

  /**
   * Load the presets
   * @return {Promise<void>}
   */
  private async load(): Promise<void> {
    const presets = await this.apiService.get('preset', {
      _page: 0,
      _limit: 100
    })
      .then(response => {
        return (<IApiPreset[]>response.data.items)
          .map((p: IApiPreset): IPreset => ({
            id: p._id,
            name: p.name,
            icon: p.icon,
            models: p.models.map((m: IApiModel): IModel => ({
              id: m._id,
              name: m.name,
              fields: m.fields,
              accesses: m.accesses,
            }))
          }));
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

  /** @inheritDoc */
  public fromObject(object: IPreset[]): Preset[] {
    this.presets = object.map((preset: IPreset): Preset => {
      const m = new Preset();
      return m.fromObject(preset);
    });
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
