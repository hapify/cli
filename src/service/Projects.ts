import { Service } from 'typedi';
import { ProjectsCollection } from '../class/ProjectsCollection';

@Service()
export class ProjectsService {
	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Returns the projects collection
	 * @return {ProjectsCollection}
	 * @throws {Error}
	 */
	async collection(): Promise<ProjectsCollection> {
		return await ProjectsCollection.getInstance();
	}
}
