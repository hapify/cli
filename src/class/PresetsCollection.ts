import S3 = require('aws-sdk/clients/s3');
import { IPreset, ISerilizable } from '../interface';
import { Preset } from './';
import { IConfigPreset } from '../interface/IObjects';

export class PresetsCollection implements ISerilizable<IPreset[], Preset[]> {

  /** @type {Preset[]} The list of preset instances */
  private presets: Preset[] = [];
  /** @type {Preset[]} The full path to the file */
  private s3service: S3;
  /** @type {string} The pseudo path */
  public path: string;
  /** @type {string} The loaded instances */
  private static instances: PresetsCollection[] = [];

  /**
   * Constructor
   * @param {IConfigPreset} config
   */
  private constructor(private config: IConfigPreset) {
    this.s3service = new S3({
      region: config.region,
      accessKeyId: config.key,
      secretAccessKey: config.secret
    });
    this.path = PresetsCollection.path(config);
  }

  /**
   * Returns a singleton for this config
   * @param {IConfigPreset} config
   */
  public static async getInstance(config: IConfigPreset) {
    const path = PresetsCollection.path(config);
    // Try to find an existing collection
    const presetsCollection = PresetsCollection.instances.find((m) => m.path === path);
    if (presetsCollection) {
      return presetsCollection;
    }
    // Create and load a new collection
    const collection = new PresetsCollection(config);
    await collection.load();
    // Keep the collection
    PresetsCollection.instances.push(collection);

    return collection;
  }

  /**
   * Load the preset from S3
   * @return {Promise<void>}
   */
  private async load(): Promise<void> {
    try {
      // Flush presets
      const presets: IPreset[] = [];

      // List object
      const objects = (await this.s3service.listObjects({
        Bucket: this.config.bucket,
        Prefix: this.config.path
      })
        .promise()).Contents.filter((o) => o.Key.endsWith('.json'));
      objects.sort((a, b) => a.Key.localeCompare(b.Key));

      // Load objects
      for (const object of objects) {

        const data = await this.s3service.getObject({
          Bucket: this.config.bucket,
          Key: object.Key
        })
          .promise();

        const content = (data.Body as Buffer).toString('utf8');
        const preset: IPreset = JSON.parse(content);
        presets.push((new Preset()).fromObject(preset));

      }

      this.fromObject(presets);
    }
    catch (error) {
      // First loading => no file => AccessDenied
      if (error.code === 'NotFound' || error.code === 'AccessDenied') {
        return;
      }
      throw error;
    }
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
  private static path(config: IConfigPreset): string {
    return `s3:${config.bucket}:${config.path}`;
  }
}
