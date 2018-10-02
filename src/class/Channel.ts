import * as Fs from 'fs';
import * as Path from 'path';
import { IChannel, IConfig, ISerilizable, IStorable } from '../interface';
import { ModelsCollection, Template, Validator, SingleSave } from './';
import { TemplateEngine, TemplateInput } from '../enum';
import md5 from 'md5';
import mkdirp from 'mkdirp';

export class Channel extends SingleSave implements IStorable, ISerilizable<IChannel, Channel> {

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
  /** @type {string} */
  public templatesPath: string;

  /**
   * Constructor
   * @param {string} path
   * @param {string|null} name
   */
  constructor(public path: string, name: string|null = null) {
    super();
    this.name = name ? name : Path.basename(path);
    this.id = md5(this.path);
    this.templatesPath = Path.join(this.path, Channel.defaultFolder);
    this.validate();
  }

  /** @inheritDoc */
  async load(): Promise<void> {

    // Copy config to instance
    const path = Path.join(this.path, Channel.configFile);
    const data = <string>Fs.readFileSync(path, 'utf8');
    this.config = JSON.parse(data);
    this.didLoad(data);

    // Load each content file
    this.templates = [];
    for (let i = 0; i < this.config.templates.length; i++) {
      const template = (new Template(this)).fromObject(Object.assign(this.config.templates[i], {content: ''}));
      await template.load();
      this.templates.push(template);
    }

    // Load models
    this.modelsCollection = await ModelsCollection.getInstance(this.config.models);

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

    // Write validator
    await this.validator.save();
    this.config.validatorPath = this.validator.path;

    // Write file if necessary
    const data = JSON.stringify(this.config, null, 2);
    if (this.shouldSave(data)) {
      const path = `${this.path}/${Channel.configFile}`;
      Fs.writeFileSync(path, data, 'utf8');
    }

    // Cleanup files in template path
    const legitFiles = [Path.join(this.path, this.config.validatorPath)];
    for (const template of this.templates) {
      legitFiles.push(Path.join(this.templatesPath, template.contentPath));
    }
    const allFiles = Channel.listAllFiles(Path.join(this.path, Channel.defaultFolder));
    for (const filePath of allFiles) {
      if (legitFiles.indexOf(filePath) < 0) {
        Fs.unlinkSync(filePath);
      }
    }
    Channel.clearEmptyDirectories(Path.join(this.path, Channel.defaultFolder));
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
      const contentPath = Path.join(this.templatesPath, Template.computeContentPath(template));
      if (!Fs.existsSync(contentPath)) {
        throw new Error(`Channel template's path ${contentPath} does not exists.`);
      }
    }

    const validatorPath = Path.join(this.path, config.validatorPath);
    if (!Fs.existsSync(validatorPath)) {
      throw new Error(`Channel validator's path ${validatorPath} does not exists.`);
    }
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
   * @return {Promise<void>}
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
      models: {
        key: 'AAAAAAAAAAA',
        secret: 'XXXXXXXXXXX',
        region: 'us-east-1',
        bucket: 'hapify-storage',
        path: 'models/cli-demo.json'
      },
      templates: [
        {
          name: 'Hello World',
          path: 'models/{model.hyphen}/hello.js',
          engine: TemplateEngine.Hpf,
          input: TemplateInput.One
        }
      ]
    };

    // Create dir
    mkdirp.sync(Path.join(path, Channel.defaultFolder, 'models', 'model'));

    // Dump config file
    const configData = JSON.stringify(config, null, 2);
    Fs.writeFileSync(configPath, configData, 'utf8');

    // Create template file
    const templateContent = `// Hello <<M A>>`;
    const templatePath = Path.join(path, Channel.defaultFolder, 'models', 'model', 'hello.js.hpf');
    Fs.writeFileSync(templatePath, templateContent, 'utf8');

    // Create validator file
    const validatorContent = `// Models validation script`;
    const validatorPath = Path.join(path, Channel.defaultFolder, 'validator.js');
    Fs.writeFileSync(validatorPath, validatorContent, 'utf8');
  }

  /** @inheritDoc */
  public fromObject(object: IChannel): Channel {

    // Do not update name nor id
    // Create or update templates if necessary
    // By keeping the same instances, we will avoid a file saving if the content did not change
    this.templates = object.templates.map((t) => {
      // Try to find an existing template
      const existing = this.templates.find((e) => e.path === t.path);
      if (existing) {
        return existing.fromObject(t);
      }
      // Otherwise create a new temaplte
      const newOne = new Template(this);
      return newOne.fromObject(t);
    });

    // Update validator
    this.validator.content = object.validator;

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
  /**
   * Get all files' absolute path from a directory
   * @param {string} rootPath
   * @return {string[]}
   */
  private static listAllFiles(rootPath: string): string[] {

    // Read the whole directory
    const entries = Fs.readdirSync(rootPath)
      .map((dir) => Path.join(rootPath, dir));

    // Get sub-files
    const subFiles = entries
      .filter((subPath) => Fs.statSync(subPath).isDirectory())
      .map((subPath) => Channel.listAllFiles(subPath))
      .reduce((flatten: string[], files: string[]) => flatten.concat(files), []);

    // Return files and sub-files
    return entries
      .filter((subPath) => Fs.statSync(subPath).isFile())
      .concat(subFiles);
  }
  /**
   * Delete all directories if empty
   * @param {string} rootPath
   */
  private static clearEmptyDirectories(rootPath: string): void {

    // Remove sub-directories
    Fs.readdirSync(rootPath)
      .map((dir) => Path.join(rootPath, dir))
      .filter((subPath) => Fs.statSync(subPath).isDirectory())
      .forEach((subPath) => Channel.clearEmptyDirectories(subPath));

    // Count remaining files & dirs
    const count = Fs.readdirSync(rootPath).length;

    if (count === 0) {
      Fs.rmdirSync(rootPath);
    }
  }
}
