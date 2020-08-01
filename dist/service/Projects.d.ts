import { ProjectsCollection } from '../class/ProjectsCollection';
export declare class ProjectsService {
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns the projects collection
     * @return {ProjectsCollection}
     * @throws {Error}
     */
    collection(): Promise<ProjectsCollection>;
}
