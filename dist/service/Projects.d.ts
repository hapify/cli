import { ProjectsCollection } from '../class/ProjectsCollection';
export declare class ProjectsService {
    constructor();
    /** Returns the projects collection */
    collection(): Promise<ProjectsCollection>;
}
