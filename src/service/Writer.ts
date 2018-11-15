import { Service } from 'typedi';
import * as Fs from 'fs';
import * as Path from 'path';
import mkdirp from 'mkdirp';
import JSZip from 'jszip';
import { IGeneratorResult } from '../interface';

@Service()
export class WriterService {

  /** Constructor */
  constructor() {}

  /**
   * Zip results and write to disk
   * @param {string} path
   * @param {IGeneratorResult[]} results
   * @return {Promise<void>}
   */
  async zip(path: string, results: IGeneratorResult[]): Promise<void> {
    // Create ZIP
    const zip = new JSZip();
    // Append files
    for (const result of results) {
      zip.file(result.path, result.content);
    }
    // Generate ZIP
    const content = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    });
    mkdirp.sync(Path.dirname(path));
    Fs.writeFileSync(path, content);
  }
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
    mkdirp.sync(Path.dirname(path));
    Fs.writeFileSync(path, result.content, 'utf8');
  }
}
