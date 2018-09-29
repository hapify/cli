import * as Fs from 'fs';
import S3 = require('aws-sdk/clients/s3');
import { IModel, IStorable, ISerilizable } from '../interface';
import { Model, Channel, SingleSave } from './';
import { IConfigModel } from '../interface/IObjects';

export class ModelsCollection extends SingleSave implements IStorable, ISerilizable<IModel[], Model[]> {

  /** @type {Model[]} The list of model instances */
  private models: Model[];
  /** @type {Model[]} The full path to the file */
  public s3service: S3;

  /**
   * Constructor
   * @param {Channel} parent
   * @param {IConfigModel} config
   */
  constructor(private parent: Channel, public config: IConfigModel) {
    super();
    this.s3service = new S3({
      region: config.region,
      accessKeyId: config.key,
      secretAccessKey: config.secret
    });
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
    /*const data = JSON.stringify(this.toObject(), null, 2);
    if (this.shouldSave(data)) {
      Fs.writeFileSync(this.modelsPath, data, 'utf8');
    }*/
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
  public path(): string {
    return `s3:${this.config.bucket}:${this.config.path}`;
  }
}
