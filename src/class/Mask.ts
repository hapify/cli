import * as Fs from 'fs';
import { IMaskConfig, IStorable } from '../interface';
import { MaskInput, MaskEngine } from '../enum';
import { Bootstrap } from './';

export class Mask implements IStorable {

  /** @type {string} The mask's name */
  name: string;
  /** @type {string} The mask's path */
  path: string;
  /** @type {string} The mask's type */
  engine: string;
  /** @type {string} Denotes if the mask has to to be ran for one or all models */
  input: string;
  /** @type {string} The mask's path */
  contentPath: string;
  /** @type {string} The mask's content */
  content: string;

  /**
   * Constructor
   * @param {Bootstrap} parent
   */
  constructor(private parent: Bootstrap) {
  }

  /**
   * Bind properties from the base object to this object
   * @param {IMaskConfig} object
   * @returns {Mask}
   *  Returns this
   */
  public fromObject(object: IMaskConfig): Mask {
    this.name = object.name;
    this.path = object.path;
    this.engine = object.engine;
    this.input = object.input;
    this.contentPath = object.contentPath;
    return this;
  }
  /**
   * Convert the instance to an object
   * @returns {IMaskConfig}
   */
  public toObject(): IMaskConfig {
    return {
      name: this.name,
      path: this.path,
      engine: this.engine,
      input: this.input,
      contentPath: this.contentPath
    };
  }
  /**
   * Denotes if the mask should be considered as empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return typeof this.content !== 'string'
      || this.content === null
      || this.content.trim().length === 0;
  }
  /**
   * Denotes if the mask needs a specific model to be generated
   * @returns {boolean}
   */
  public needsModel(): boolean {
    return this.input === MaskInput.One;
  }
  /**
   * Get the extension of the input file
   * @returns {string}
   */
  public extension(): string {
    if (this.engine === MaskEngine.Hpf) {
      return 'hpf';
    } else if (this.engine === MaskEngine.doT) {
      return 'dot';
    }
    return 'js';
  }

  /** @inheritDoc */
  public async load(): Promise<void> {
    const contentPath = `${this.parent.path}/${this.contentPath}`;
    this.content = <string>Fs.readFileSync(contentPath, 'utf8');
  }
  /** @inheritDoc */
  async save(): Promise<void> {
    const contentPath = `${this.parent.path}/${this.contentPath}`;
    Fs.writeFileSync(contentPath, this.content, 'utf8');
  }
}
