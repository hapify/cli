import * as Fs from 'fs';
import { IConfig, IStorable } from '../interface';
import { Template, Validator } from './';

export class Channel implements IStorable {

  /** @type {string} */
  private configFile = 'hapify.json';
  /** @type {IConfig} */
  private config: IConfig;
  /** @type {Template[]} Templates instances */
  private templates: Template[];
  /** @type {Template[]} Templates instances */
  private validator: Validator;

  /**
   * Constructor
   * @param {string} path
   */
  constructor(public path: string) {
    this.validate();
  }

  /** @inheritDoc */
  async load(): Promise<void> {

    // Copy config to instance
    const path = `${this.path}/${this.configFile}`;
    this.config = JSON.parse(<string>Fs.readFileSync(path, 'utf8'));

    // Load each content file
    this.templates = [];
    for (let i = 0; i < this.config.templates.length; i++) {
      const template = (new Template(this)).fromObject(this.config.templates[i]);
      await template.load();
      this.templates.push(template);
    }

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

    // Write validator
    await this.validator.save();
    this.config.validatorPath = this.validator.path;

    // Write file
    const path = `${this.path}/${this.configFile}`;
    const data = JSON.stringify(this.config, null, 2);
    Fs.writeFileSync(path, data, 'utf8');
  }
  /**
   * Denotes if the template should be considered as empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    const validatorIsEmpty = this.validator.isEmpty();
    const templatesAreEmpty = this.templates.every((template: Template): boolean => template.isEmpty());

    return validatorIsEmpty && templatesAreEmpty;
  }
  /**
   * Remove empty templates
   * @returns {void}
   */
  public filter(): void {
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
    const path = `${this.path}/${this.configFile}`;
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
}
