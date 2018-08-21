import * as Fs from 'fs';
import { IBootstrapConfig, IStorable } from '../interface';
import { Mask, Validator } from './';

export class Bootstrap implements IStorable {

  /** @type {string} */
  private configFile = 'hapify.json';
  /** @type {IBootstrapConfig} */
  private config: IBootstrapConfig;
  /** @type {Mask[]} Masks instances */
  private masks: Mask[];
  /** @type {Mask[]} Masks instances */
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
    this.masks = [];
    for (let i = 0; i < this.config.masks.length; i++) {
      const mask = (new Mask(this)).fromObject(this.config.masks[i]);
      await mask.load();
      this.masks.push(mask);
    }

    // Load validator
    this.validator = new Validator(this, this.config.validatorPath);
    await this.validator.load();
  }
  /** @inheritDoc */
  async save(): Promise<void> {

    // Copy all contents to files and update config
    for (const mask of this.masks) {
      await mask.save();
    }
    this.config.masks = this.masks.map((m) => m.toObject());

    // Write validator
    await this.validator.save();
    this.config.validatorPath = this.validator.path;

    // Write file
    const path = `${this.path}/${this.configFile}`;
    const data = JSON.stringify(this.config, null, 2);
    Fs.writeFileSync(path, data, 'utf8');
  }
  /**
   * Denotes if the mask should be considered as empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    const validatorIsEmpty = this.validator.isEmpty();
    const masksAreEmpty = this.masks.every((mask: Mask): boolean => mask.isEmpty());

    return validatorIsEmpty && masksAreEmpty;
  }
  /**
   * Remove empty masks
   * @returns {void}
   */
  public filter(): void {
    this.masks = this.masks.filter((mask: Mask): boolean => {
      return !mask.isEmpty();
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
      throw new Error(`Bootstrap config's path ${path} does not exists.`);
    }

    let config: IBootstrapConfig;
    try {
      config = JSON.parse(<string>Fs.readFileSync(path, 'utf8'));
    } catch (error) {
      throw new Error(`An error occurred while reading Bootstrap config's at ${path}: ${error.toString()}`);
    }

    for (const mask of config.masks) {
      const contentPath = `${this.path}/${mask.contentPath}`;
      if (!Fs.existsSync(contentPath)) {
        throw new Error(`Bootstrap mask's path ${contentPath} does not exists.`);
      }
    }

    const validatorPath = `${this.path}/${config.validatorPath}`;
    if (!Fs.existsSync(validatorPath)) {
      throw new Error(`Bootstrap validator's path ${validatorPath} does not exists.`);
    }
  }
}
