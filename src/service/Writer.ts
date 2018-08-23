import { Service } from 'typedi';
import * as Fs from 'fs';
import * as Path from 'path';
import { IGeneratorResult } from '../interface/IGeneratorResult';

@Service()
export class WriterService {

  /** Constructor */
  constructor() {}

  /**
   * Write results to disk
   * @param {string} root
   * @param {IGeneratorResult[]} results
   * @return {Promise<void>}
   */
  async writeMany(root: string, results: IGeneratorResult[]): Promise<void> {
    for (const result of results) {
      await this.write(root, result);
    }
  }
  /**
   * Write on result to disk
   * @param {string} root
   * @param {IGeneratorResult} result
   * @return {Promise<void>}
   */
  async write(root: string, result: IGeneratorResult): Promise<void> {
    const path = Path.join(root, result.path);
    await this.ensureDir(path);
    Fs.writeFileSync(path, result.content, 'utf8');
  }

  /**
   * Create containing directory
   * @param {string} path
   * @return {Promise<void>}
   */
  private async ensureDir(path: string): Promise<void> {
    const dirPath = Path.dirname(path);
    if (Fs.existsSync(dirPath)) {
      return;
    }
    await this.ensureDir(dirPath);
    Fs.mkdirSync(dirPath);
  }
}
