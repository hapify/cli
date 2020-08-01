import { Service } from 'typedi';
import { BoilerplatesCollection } from '../class/BoilerplatesCollection';

@Service()
export class BoilerplatesService {
	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Returns the boilerplates collection
	 * @return {BoilerplatesCollection}
	 * @throws {Error}
	 */
	async collection(): Promise<BoilerplatesCollection> {
		return await BoilerplatesCollection.getInstance();
	}
}
