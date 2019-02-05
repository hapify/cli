import { Service } from 'typedi';
import { ConfigRemote } from '../../../config';
import { ApiService, IApiBoilerplate } from '../../Api';
import { IBoilerplate } from '../../../interface';

interface BoilerplatesSearchParams {
	_page?: string | number;
	_limit?: string | number;
	_sort?: string;
	_order?: string;
	_id?: string[];
	owner?: string;
	premium?: string | boolean;
	name?: string;
	slug?: string;
	type?: string;
	technologies?: string[];
	features?: string[];
}

@Service()
export class BoilerplatesApiStorageService {
	/** Constructor */
	constructor(private apiService: ApiService) {}

	/** Load the boilerplates from api */
	async list(
		searchParams: BoilerplatesSearchParams = {}
	): Promise<IBoilerplate[]> {
		return await this.apiService
			.get(
				'boilerplate',
				Object.assign(
					{
						_page: 0,
						_limit: ConfigRemote.boilerplatesLimit
					},
					searchParams
				)
			)
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
