import { Service } from 'typedi';
import { PresetsCollection } from '../class';

@Service()
export class PresetsService {

  /**
   * Constructor
   */
  constructor () {
  }

  /**
   * Returns the presets collection
   * @return {PresetsCollection}
   * @throws {Error}
   */
  public async collection(): Promise<PresetsCollection> {
    return await PresetsCollection.getInstance();
  }
}
