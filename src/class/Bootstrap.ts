import * as Fs from 'fs';
import { IBootstrap, IMask, IStorable } from '../interface';

export class Bootstrap implements IStorable {

  /** @type {string} */
  private configFile = 'hapify.json';
  /** @type {IBootstrap} */
  private config: IBootstrap;

  /**
   * Constructor
   * @param {string} path
   */
  constructor(private path: string) {
    this.validate();
  }

  /** @inheritDoc */
  async load(): Promise<void> {
    // Copy config to instance
    const path = `${this.path}/${this.configFile}`;
    this.config = JSON.parse(<string>Fs.readFileSync(path, 'utf8'));
    // Load each content file
    for (let i = 0; i < this.config.masks.length; i++) {
      const contentPath = `${this.path}/${this.config.masks[i].contentPath}`;
      this.config.masks[i].content = <string>Fs.readFileSync(contentPath, 'utf8');
    }
    // Load validator
    const validatorPath = `${this.path}/${this.config.validatorPath}`;
    this.config.validator = <string>Fs.readFileSync(validatorPath, 'utf8');
  }
  /** @inheritDoc */
  async save(): Promise<void> {
    // Copy all contents to files
    for (let i = 0; i < this.config.masks.length; i++) {
      const contentPath = `${this.path}/${this.config.masks[i].contentPath}`;
      Fs.writeFileSync(contentPath, this.config.masks[i].content, 'utf8');
    }
    // Write validator
    const validatorPath = `${this.path}/${this.config.validatorPath}`;
    Fs.writeFileSync(validatorPath, this.config.validator, 'utf8');
    // Clone o and filter object, then save it
    const clone: IBootstrap = Object.assign({}, this.config);
    delete clone.validator;
    clone.masks = clone.masks.map((mask: IMask) => {
      delete mask.content;
      return mask;
    });
    // Write file
    const path = `${this.path}/${this.configFile}`;
    const data = JSON.stringify(clone, null, 2);
    Fs.writeFileSync(path, data, 'utf8');
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

    let config: IBootstrap;
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
