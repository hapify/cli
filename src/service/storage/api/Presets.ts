import { Service } from 'typedi';
import { ConfigRemote } from '../../../config';
import { ApiService, IApiModel, IApiPreset } from '../../Api';
import { IModel, IPreset } from '../../../interface';

@Service()
export class PresetsApiStorageService {
	/** Constructor */
	constructor(private apiService: ApiService) {}

	/** Load the presets from api */
	async list(): Promise<IPreset[]> {
		return await this.apiService
			.get('preset', {
				_page: 0,
				_limit: ConfigRemote.presetsLimit
			})
			.then(response => {
				return (<IApiPreset[]>response.data.items).map(
					(p: IApiPreset): IPreset => ({
						id: p._id,
						name: p.name,
						name__fr: p.name__fr,
						description: p.description,
						description__fr: p.description__fr,
						icon: p.icon,
						models: p.models.map(
							(m: IApiModel): IModel => ({
								id: m._id,
								name: m.name,
								fields: m.fields,
								accesses: m.accesses
							})
						)
					})
				);
			});
	}
}
