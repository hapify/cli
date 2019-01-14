import { Service } from 'typedi';
import * as Path from 'path';
import { OptionsService } from './Options';
import * as Fs from 'fs';
import { ModelsCollection, Channel } from '../class';

@Service()
export class ChannelsService {

  /** @type {Channel[]} Channels instances */
  private _channels: Channel[];

  /**
   * Constructor
   * @param optionsService
   */
  constructor(private optionsService: OptionsService) {
  }

  /**
   * Get the channels. Load them if not loaded yet
   * @return {Channel[]}
   * @throws {Error}
   */
  public async channels(): Promise<Channel[]> {
    if (!(this._channels instanceof Array)) {
      this._channels = ChannelsService.sniff(this.optionsService.dir(), this.optionsService.depth());
      if (this._channels.length === 0) {
        throw new Error('No channel found');
      }
      for (const channel of this._channels) {
        await channel.load();
      }
    }
    return this._channels;
  }

  /**
   * Returns the first models collection
   * @return {ModelsCollection}
   * @throws {Error}
   */
  public async modelsCollection(): Promise<ModelsCollection> {
    const channels = await this.channels();
    return channels[0].modelsCollection;
  }

  /**
   * This method detect all channels in the directory and its sub-directories, and create instances for them.
   * We can define the depth level of subdirectories.
   * @param {string} path
   * @param {number} depth  Default: 2
   * @param {number} from  Default: path
   * @return {Channel[]}
   */
  private static sniff(path: string, depth: number = 2, from: string = path): Channel[] {

    // Get channels in sub-directories first
    const channels: Channel[] = depth <= 0 ? [] :
      Fs.readdirSync(path)
        .map((dir) => Path.join(path, dir))
        .filter((subPath) => Fs.statSync(subPath).isDirectory())
        .map((subPath) => ChannelsService.sniff(subPath, depth - 1, from))
        .reduce((flatten: Channel[], channels: Channel[]) => flatten.concat(channels), []);

    // Get channel of current directory if exists
    if (Channel.configExists(path)) {
      const name = Path.relative(Path.dirname(from), path);
      const channel = new Channel(path, name);
      channels.push(channel);
    }

    return channels;
  }
}
