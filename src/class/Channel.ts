import * as Fs from 'fs';
import * as Path from 'path';
import { IConfig, IStorable, IChannel, ISerilizable } from '../interface';
import { Template, Validator, ModelsCollection } from './';
import { TemplateEngine, TemplateInput } from '../enum';
import md5 from 'md5';

export class Channel implements IStorable, ISerilizable<IChannel, Channel> {

  /** @type {string} */
  public name: string;
  /** @type {string} */
  public id: string;
  /** @type {string} */
  private static defaultFolder = 'hapify';
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
    this.id = md5(this.name);
  }

  /** @inheritDoc */
  async load(): Promise<void> {

    // Copy config to instance
    const path = Path.join(this.path, Channel.configFile);
    this.config = JSON.parse(<string>Fs.readFileSync(path, 'utf8'));

    // Load each content file
    this.templates = [];
    for (let i = 0; i < this.config.templates.length; i++) {
      const template = (new Template(this)).fromObject(Object.assign(this.config.templates[i], {content: ''}));
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
    this.config.templates = this.templates.map((m: Template) => {
      const t = m.toObject();
      delete t.content;
      return t;
    });

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
    const path = Path.join(this.path, Channel.configFile);
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
      const contentPath = Path.join(this.path, template.contentPath);
      if (!Fs.existsSync(contentPath)) {
        throw new Error(`Channel template's path ${contentPath} does not exists.`);
      }
    }

    const validatorPath = Path.join(this.path, config.validatorPath);
    if (!Fs.existsSync(validatorPath)) {
      throw new Error(`Channel validator's path ${validatorPath} does not exists.`);
    }

    const modelsPath = Path.join(this.path, config.modelsPath);
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
    const configPath = Path.join(path, Channel.configFile);
    if (Fs.existsSync(configPath)) {
      const name = Path.relative(Path.dirname(from), path);
      const channel = new Channel(path, name);
      channels.push(channel);
    }

    return channels;
  }
  /**
   * Denotes if the config file exists
   * @param {string} path
   * @return {boolean}
   */
  public static configExists(path: string): boolean {
    const configPath = Path.join(path, Channel.configFile);
    return Fs.existsSync(configPath);
  }
  /**
   * Init a Hapify structure within a directory
   * @param {string} path
   * @return {Channel[]}
   */
  public static async create(path: string): Promise<void> {
    if (!Fs.existsSync(path)) {
      throw new Error(`Channel's path ${path} does not exists.`);
    }
    const configPath = Path.join(path, Channel.configFile);
    if (Fs.existsSync(configPath)) {
      throw new Error(`A channel already exists in this directory.`);
    }
    const config: IConfig = {
      validatorPath: `${Channel.defaultFolder}/validator.js`,
      modelsPath: '../models.json',
      templates: [
        {
          name: 'Hello World',
          path: 'models/{model.hyphen}/hello.js',
          engine: TemplateEngine.Hpf,
          input: TemplateInput.One,
          contentPath: `${Channel.defaultFolder}/model/hello.js.hpf`
        }
      ]
    };

    // Create dir
    Fs.mkdirSync(Path.join(path, Channel.defaultFolder));
    Fs.mkdirSync(Path.join(path, Channel.defaultFolder, 'model'));

    // Dump config file
    const configData = JSON.stringify(config, null, 2);
    Fs.writeFileSync(configPath, configData, 'utf8');

    // Create template file
    const templateContent = `// Hello <<M A>>`;
    const templatePath = Path.join(path, Channel.defaultFolder, 'model', 'hello.js.hpf');
    Fs.writeFileSync(templatePath, templateContent, 'utf8');

    // Create validator file
    const validatorContent = `// Models validation script`;
    const validatorPath = Path.join(path, Channel.defaultFolder, 'validator.js');
    Fs.writeFileSync(validatorPath, validatorContent, 'utf8');
  }

  /** @inheritDoc */
  public fromObject(object: IChannel): Channel {
    // this.id = object.id;
    // this.name = object.name;
    // this.templates = object.fields.map((fieldBase: IField): Field => {
    //   const field = new Field();
    //   return field.fromObject(fieldBase);
    // });
    return this;
  }
  /** @inheritDoc */
  public toObject(): IChannel {
    return {
      id: this.id,
      name: this.name,
      templates: this.templates.map((template: Template) => template.toObject()),
      validator: this.validator.content
    };
  }
}
