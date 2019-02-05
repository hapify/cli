import { Service } from 'typedi';
import { ConfigRemote } from '../../../config';
import { ApiService, IApiBoilerplate } from '../../Api';
import { IBoilerplate } from '../../../interface';

@Service()
export class BoilerplatesApiStorageService {
	/** Constructor */
	constructor(private apiService: ApiService) {}

	/** Load the boilerplates from api */
	async list(): Promise<IBoilerplate[]> {
		return await this.apiService
			.get('boilerplate', {
				_page: 0,
				_limit: ConfigRemote.boilerplatesLimit
			})
			.then(response => {
				return (<IApiBoilerplate[]>response.data.items).map(
					(p: IApiBoilerplate): IBoilerplate => ({
						id: p._id,
						slug: p.slug,
						name: p.name,
						git_url: p.git_url
					})
				);
			});
	}
}
