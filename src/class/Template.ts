import * as Fs from 'fs';
import { ITemplateConfig, IStorable } from '../interface';
import { TemplateInput, TemplateEngine } from '../enum';
import { Channel } from './';

export class Template implements IStorable {

  /** @type {string} The template's name */
  name: string;
  /** @type {string} The template's path */
  path: string;
  /** @type {string} The template's type */
  engine: string;
  /** @type {string} Denotes if the template has to to be ran for one or all models */
  input: string;
  /** @type {string} The template's path */
  contentPath: string;
  /** @type {string} The template's content */
  content: string;

  /**
   * Constructor
   * @param {Channel} parent
   */
  constructor(private parent: Channel) {
  }

  /**
   * Bind properties from the base object to this object
   * @param {ITemplateConfig} object
   * @returns {Template}
   *  Returns this
   */
  public fromObject(object: ITemplateConfig): Template {
    this.name = object.name;
    this.path = object.path;
    this.engine = object.engine;
    this.input = object.input;
    this.contentPath = object.contentPath;
    return this;
  }
  /**
   * Convert the instance to an object
   * @returns {ITemplateConfig}
   */
  public toObject(): ITemplateConfig {
    return {
      name: this.name,
      path: this.path,
      engine: this.engine,
      input: this.input,
      contentPath: this.contentPath
    };
  }
  /**
   * Denotes if the template should be considered as empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return typeof this.content !== 'string'
      || this.content === null
      || this.content.trim().length === 0;
  }
  /**
   * Denotes if the template needs a specific model to be generated
   * @returns {boolean}
   */
  public needsModel(): boolean {
    return this.input === TemplateInput.One;
  }
  /**
   * Get the extension of the input file
   * @returns {string}
   */
  public extension(): string {
    if (this.engine === TemplateEngine.Hpf) {
      return 'hpf';
    } else if (this.engine === TemplateEngine.doT) {
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
