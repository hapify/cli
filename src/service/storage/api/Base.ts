import { Service } from 'typedi';
import { ApiService } from '../../Api';

/** Used to export and import search params */
export interface BaseSearchParams {
	_page?: string | number;
	_limit?: string | number;
	_sort?: string;
	_order?: string;
	_id?: string[];
}

@Service()
/**
 * T: Internal interface
 * I: Api Interface
 * S: Search params
 */
export abstract class BaseApiStorageService<T, I, S extends BaseSearchParams> {
	/** Constructor */
	constructor(private apiService: ApiService) {}

	/**
	 * Create a new model
	 * @param {I} payload
	 * @return {Promise<T>}
	 */
	async create(payload: I): Promise<T> {
		const output: I = (await this.apiService.post(
			`${this.path()}`,
			payload
		)).data;
		return this.fromApi(output);
	}

	/**
	 * Update an model selected from it's id
	 * @param {string} id
	 * @param {T} payload
	 * @return {Promise<any>}
	 */
	async update(id: string, payload: I): Promise<void> {
		await this.apiService.patch(`${this.path()}/${id}`, payload);
	}

	/**
	 * Get an model from it's id
	 * @param {string} id
	 * @return {Promise<T>}
	 */
	async get(id: string): Promise<T> {
		const output: I = (await this.apiService.get(`${this.path()}/${id}`))
			.data;
		return this.fromApi(output);
	}

	/**
	 * Delete an model selected from it's id
	 * @param {string} id
	 * @return {Promise<any>}
	 */
	async remove(id: string): Promise<void> {
		await this.apiService.delete(`${this.path()}/${id}`);
	}

	/**
	 * Get list for model search
	 * @param {S} searchParams
	 * @return {Promise<T[]> >}
	 */
	async list(searchParams?: S): Promise<T[]> {
		const output: I[] = (await this.apiService.get(
			`${this.path()}`,
			Object.assign(this.defaultSearchParams(), searchParams)
		)).data.items;
		return output.map(o => this.fromApi(o));
	}

	/**
	 * Count for model
	 * @param {S} searchParams
	 * @return {Promise<number>}
	 */
	async count(searchParams: S): Promise<number> {
		// Remove unwanted properties
		const params = Object.assign(
			{},
			this.defaultSearchParams(),
			searchParams
		);
		delete params._page;
		delete params._limit;
		delete params._order;
		delete params._sort;
		return (await this.apiService.get(
			`${this.path()}/count`,
			Object.assign(this.defaultSearchParams(), searchParams)
		)).data.total;
	}

	/** Get the default search params (limit, page, etc...) */
	protected defaultSearchParams(): any {
		return {
			_page: 0,
			_limit: 20
		};
	}

	/** Returns the base URI for this model */
	protected abstract path(): string;

	/** Convert an incoming payload to an internal payload */
	protected abstract fromApi(object: I): T;
}
