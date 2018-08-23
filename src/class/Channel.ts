import * as Fs from 'fs';
import * as Path from 'path';
import { IConfig, IStorable } from '../interface';
import { Template, Validator, ModelsCollection } from './';

export class Channel implements IStorable {

  /** @type {string} */
  public name: string;
  /** @type {string} */
  private static configFile = 'hapify.json';
  /** @type {IConfig} */
  private config: IConfig;
  /** @type {Template[]} Templates instances */
  public templates: Template[];
  /** @type {Template[]} Templates instances */
  public validator: Validator;
  /** @type {ModelsCollection} List of models container */
  public modelsCollection: ModelsCollection;

  /**
   * Constructor
   * @param {string} path
   * @param {string|null} name
   */
  constructor(public path: string, name: string|null = null) {
    this.validate();
    this.name = name ? name : Path.basename(path);
  }

  /** @inheritDoc */
  async load(): Promise<void> {

    // Copy config to instance
    const path = `${this.path}/${Channel.configFile}`;
    this.config = JSON.parse(<string>Fs.readFileSync(path, 'utf8'));

    // Load each content file
    this.templates = [];
    for (let i = 0; i < this.config.templates.length; i++) {
      const template = (new Template(this)).fromObject(this.config.templates[i]);
      await template.load();
      this.templates.push(template);
    }

    // Load models
    this.modelsCollection = new ModelsCollection(this, this.config.modelsPath);
    await this.modelsCollection.load();

    // Load validator
    this.validator = new Validator(this, this.config.validatorPath);
    await this.validator.load();
  }
  /** @inheritDoc */
  async save(): Promise<void> {

    // Copy all contents to files and update config
    for (const template of this.templates) {
      await template.save();
    }
    this.config.templates = this.templates.map((m) => m.toObject());

    // Write models
    await this.modelsCollection.save();
    this.config.modelsPath = this.modelsCollection.path;

    // Write validator
    await this.validator.save();
    this.config.validatorPath = this.validator.path;

    // Write file
    const path = `${this.path}/${Channel.configFile}`;
    const data = JSON.stringify(this.config, null, 2);
    Fs.writeFileSync(path, data, 'utf8');
  }
  /**
   * Denotes if the template should be considered as empty
   * @returns {boolean}
   */
  isEmpty(): boolean {
    const validatorIsEmpty = this.validator.isEmpty();
    const templatesAreEmpty = this.templates.every((template: Template): boolean => template.isEmpty());

    return validatorIsEmpty && templatesAreEmpty;
  }
  /**
   * Remove empty templates
   * @returns {void}
   */
  filter(): void {
    this.templates = this.templates.filter((template: Template): boolean => {
      return !template.isEmpty();
    });
  }
  /**
   * Denotes if the config file exists and its templates
   * If something is not valid, it throws an error.
   * @throws {Error}
   */
  private validate(): void {
    const path = `${this.path}/${Channel.configFile}`;
    if (!Fs.existsSync(path)) {
      throw new Error(`Channel config's path ${path} does not exists.`);
    }

    let config: IConfig;
    try {
      config = JSON.parse(<string>Fs.readFileSync(path, 'utf8'));
    } catch (error) {
      throw new Error(`An error occurred while reading Channel config's at ${path}: ${error.toString()}`);
    }

    for (const template of config.templates) {
      const contentPath = `${this.path}/${template.contentPath}`;
      if (!Fs.existsSync(contentPath)) {
        throw new Error(`Channel template's path ${contentPath} does not exists.`);
      }
    }

    const validatorPath = `${this.path}/${config.validatorPath}`;
    if (!Fs.existsSync(validatorPath)) {
      throw new Error(`Channel validator's path ${validatorPath} does not exists.`);
    }

    const modelsPath = `${this.path}/${config.modelsPath}`;
    if (!Fs.existsSync(modelsPath)) {
      throw new Error(`Channel models' path ${modelsPath} does not exists.`);
    }
  }
  /**
   * This method detect all channels in the directory and its sub-directories, and create instances for them.
   * We can define the depth level of subdirectories.
   * @param {string} path
   * @param {number} depth  Default: 2
   * @param {number} from  Default: path
   * @return {Channel[]}
   */
  public static sniff(path: string, depth: number = 2, from: string = path): Channel[] {

    // Get channels in sub-directories first
    const channels: Channel[] = depth <= 0 ? [] :
      Fs.readdirSync(path)
        .map((dir) => Path.join(path, dir))
        .filter((subPath) => Fs.statSync(subPath).isDirectory())
        .map((subPath) => Channel.sniff(subPath, depth - 1, from))
        .reduce((flatten: Channel[], channels: Channel[]) => flatten.concat(channels), []);

    // Get channel of current directory if exists
    const configPath = `${path}/${Channel.configFile}`;
    if (Fs.existsSync(configPath)) {
      const name = Path.relative(Path.dirname(from), path);
      const channel = new Channel(path, name);
      channels.push(channel);
    }

    return channels;
  }
}
