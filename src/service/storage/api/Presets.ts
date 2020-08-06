import { Service } from 'typedi';
import { BaseApiStorageService, BaseSearchParams } from './Base';
import { IApiModel } from './Models';
import { IModel } from '../../../interface/Generator';
import { IPreset } from '../../../interface/Objects';

interface PresetsSearchParams extends BaseSearchParams {
	version?: string;
	name?: string;
	slug?: string;
	models?: string[];
}
export interface IApiPreset {
	_id?: string;
	created_at?: number;
	version?: string;
	name?: string;
	name__fr?: string;
	description?: string;
	description__fr?: string;
	slug?: string;
	icon?: string;
	models?: IApiModel[];
}

@Service()
export class PresetsApiStorageService extends BaseApiStorageService<IPreset, IApiPreset, PresetsSearchParams> {
	protected defaultSearchParams(): any {
		const s = super.defaultSearchParams();
		s._limit = this.remoteConfig.presetsLimit;
		return s;
	}

	protected path(): string {
		return 'preset';
	}

	protected fromApi(object: IApiPreset): IPreset {
		return {
			id: object._id,
			name: object.name,
			name__fr: object.name__fr,
			description: object.description,
			description__fr: object.description__fr,
			icon: object.icon,
			models: object.models.map(
				(m: IApiModel): IModel => ({
					id: m._id,
					name: m.name,
					notes: m.notes || null,
					fields: m.fields,
					accesses: m.accesses,
				})
			),
		};
	}
}
