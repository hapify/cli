import * as Fs from 'fs';
import { IStorable } from '../interface';
import { Bootstrap } from './';

export class Validator implements IStorable {

  /** @type {string} The validator's script content */
  content: string;

  /**
   * Constructor
   * @param {Bootstrap} parent
   * @param {string} path
   */
  constructor(private parent: Bootstrap, public path: string) {
  }

  /** @inheritDoc */
  public async load(): Promise<void> {
    const contentPath = `${this.parent.path}/${this.path}`;
    this.content = <string>Fs.readFileSync(contentPath, 'utf8');
  }
  /** @inheritDoc */
  async save(): Promise<void> {
    const contentPath = `${this.parent.path}/${this.path}`;
    Fs.writeFileSync(contentPath, this.content, 'utf8');
  }
  /**
   * Denotes if the validator should be considered as empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return typeof this.content !== 'string'
      || this.content === null
      || this.content.trim().length === 0;
  }
}
