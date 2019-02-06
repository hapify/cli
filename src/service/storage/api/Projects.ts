import { Service } from 'typedi';
import { IProject } from '../../../interface';
import { BaseSearchParams, BaseApiStorageService } from './Base';
import { ConfigRemote } from '../../../config';

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

@Service()
export class ProjectsApiStorageService extends BaseApiStorageService<
	IProject,
	IApiProject,
	ProjectsSearchParams
> {
	/** @inheritDoc */
	protected defaultSearchParams(): any {
		const s = super.defaultSearchParams();
		s._limit = ConfigRemote.projectsLimit;
		return s;
	}

	/** @inheritDoc */
	protected path(): string {
		return 'project';
	}

	/** @inheritDoc */
	protected fromApi(object: IApiProject): IProject {
		return {
			id: object._id,
			created_at: object.created_at,
			name: object.name,
			description: object.description
		};
	}
}
