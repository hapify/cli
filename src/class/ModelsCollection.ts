import S3 = require('aws-sdk/clients/s3');
import { IModel, IStorable, ISerilizable } from '../interface';
import { Model, SingleSave } from './';
import { IConfigModel } from '../interface/IObjects';

export class ModelsCollection extends SingleSave implements IStorable, ISerilizable<IModel[], Model[]> {

  /** @type {Model[]} The list of model instances */
  private models: Model[];
  /** @type {Model[]} The full path to the file */
  private s3service: S3;
  /** @type {string} The pseudo path */
  public path: string;
  /** @type {string} The loaded instances */
  private static instances: ModelsCollection[] = [];

  /**
   * Constructor
   * @param {IConfigModel} config
   */
  private constructor(public config: IConfigModel) {
    super();
    this.s3service = new S3({
      region: config.region,
      accessKeyId: config.key,
      secretAccessKey: config.secret
    });
    this.path = ModelsCollection.path(config);
  }

  /**
   * Returns a singleton for this config
   * @param {IConfigModel} config
   */
  public static async getInstance(config: IConfigModel) {
    const path = ModelsCollection.path(config);
    // Try to find an existing collection
    const modelsCollection = ModelsCollection.instances.find((m) => m.path === path);
    if (modelsCollection) {
      return modelsCollection;
    }
    // Create and load a new collection
    const collection = new ModelsCollection(config);
    await collection.load();
    // Keep the collection
    ModelsCollection.instances.push(collection);

    return collection;
  }

  /** @inheritDoc */
  public async load(): Promise<void> {

   const models = await this.s3service.getObject({
      Bucket: this.config.bucket,
      Key: this.config.path
    })
      .promise()
      .then((data) => {
        const content = (data.Body as Buffer).toString('utf8');
        const models: IModel[] = JSON.parse(content);
        this.didLoad(content);
        return models;
      })
      .catch((error) => {
        // First loading => no file => AccessDenied
        if (error.code === 'NotFound' || error.code === 'AccessDenied') {
          return [];
        }
        throw error;
      });
    this.fromObject(models);
  }
  /** @inheritDoc */
  async save(): Promise<void> {
    const data = JSON.stringify(this.toObject(), null, 2);
    if (this.shouldSave(data)) {
      await this.s3service.putObject({
        Body: Buffer.from(data, 'utf8'),
        Bucket: this.config.bucket,
        Key: this.config.path
      })
        .promise();
    }
  }
  /**
   * Find a instance with its id
   * @param {string} id
   * @returns {Promise<Model|null>}
   */
  async find(id: string): Promise<Model|null> {
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
  private static path(config: IConfigModel): string {
    return `s3:${config.bucket}:${config.path}`;
  }
}
