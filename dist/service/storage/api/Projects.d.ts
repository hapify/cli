import { BaseApiStorageService, BaseSearchParams } from './Base';
import { IProject } from '../../../interface/Objects';
interface ProjectsSearchParams extends BaseSearchParams {
    name?: string;
}
export interface IApiProject {
    _id?: string;
    created_at?: number;
    name?: string;
    description?: string | null;
    owner?: string | any;
}
export declare class ProjectsApiStorageService extends BaseApiStorageService<IProject, IApiProject, ProjectsSearchParams> {
    protected defaultSearchParams(): any;
    protected path(): string;
    protected fromApi(object: IApiProject): IProject;
}
export {};
