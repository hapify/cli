import { Service } from 'typedi';
import { ApiService, IApiProject } from '../../Api';
import { IProject } from '../../../interface';

@Service()
export class ProjectApiStorageService {
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
}
