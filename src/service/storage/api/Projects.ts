import { Service } from 'typedi';
import { ApiService, IApiProject } from '../../Api';
import { IProject } from '../../../interface';
import { ConfigRemote } from '../../../config';

interface ProjectsSearchParams {
	_page?: string | number;
	_limit?: string | number;
	_sort?: string;
	_order?: string;
	_id?: string[];
	name?: string;
}

@Service()
export class ProjectsApiStorageService {
	/** Constructor */
	constructor(private apiService: ApiService) {}

	/** Load the project from api */
	async get(project: string): Promise<IProject> {
		const output: IApiProject = (await this.apiService.get(
			`project/${project}`
		)).data;
		return {
			id: output._id,
			created_at: output.created_at,
			name: output.name,
			description: output.description
		};
	}

	/** Load the projects from api */
	async list(searchParams: ProjectsSearchParams = {}): Promise<IProject[]> {
		return await this.apiService
			.get(
				'project',
				Object.assign(
					{
						_page: 0,
						_limit: ConfigRemote.projectsLimit
					},
					searchParams
				)
			)
			.then(response => {
				return (<IApiProject[]>response.data.items).map(
					(p: IApiProject): IProject => ({
						id: p._id,
						created_at: p.created_at,
						name: p.name,
						description: p.description
					})
				);
			});
	}
}
