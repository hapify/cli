import md5 from 'md5';
import { Service } from 'typedi';
import { ConfigRemote } from '../../../config';
import { ApiService, IApiModel } from '../../Api';
import { IModel } from '../../../interface';
import { Model, FieldType } from '../../../class';

@Service()
export class ModelsApiStorageService {
	/** The models fingerprints */
	private hashes: { [id: string]: string } = {};
	/** Constructor */
	constructor(private apiService: ApiService) {}

	/** Load the models from api */
	async list(project: string): Promise<IModel[]> {
		const models: IModel[] = await await this.apiService
			.get('model', {
				_page: 0,
				_limit: ConfigRemote.modelsLimit,
				project: project
			})
			.then(response => {
				return (<IApiModel[]>response.data.items).map(
					(m: IApiModel): IModel => ({
						id: m._id,
						name: m.name,
						fields: m.fields,
						accesses: m.accesses
					})
				);
			});

		this.updateHashes(models);
		return models;
	}

	/** Send models to API if necessary */
	async set(project: string, models: IModel[]): Promise<IModel[]> {
		// Get models to create
		const toCreate = models.filter(
			m => typeof this.hashes[m.id] === 'undefined'
		);

		// Init map to match temp id to real id
		const createdMap: { [id: string]: string } = {};

		// Create models and update id
		for (const model of toCreate) {
			const response = await this.apiService.post('model', {
				project: project,
				name: model.name,
				fields: model.fields,
				accesses: model.accesses
			});
			model.id = response.data._id;
			createdMap[model.id] = response.data._id;
		}

		/** Change references from temp id to real id and denotes if a change was made */
		const changeReferencesToNewModels = (m: IModel): boolean => {
			let changed = false;
			for (const f of m.fields) {
				if (
					f.type === FieldType.Entity &&
					typeof createdMap[f.reference] === 'string'
				) {
					f.reference = createdMap[f.reference];
					changed = true;
				}
			}
			return changed;
		};

		// Update created references
		for (const model of toCreate) {
			if (changeReferencesToNewModels(model)) {
				await this.apiService.patch(`model/${model.id}`, {
					fields: model.fields
				});
			}
		}

		// Get models to update
		const toUpdate = models.filter(
			m =>
				typeof this.hashes[m.id] === 'string' &&
				this.hashes[m.id] !== ModelsApiStorageService.hash(m)
		);

		// Update models
		for (const model of toUpdate) {
			changeReferencesToNewModels(model);
			await this.apiService.patch(`model/${model.id}`, {
				name: model.name,
				fields: model.fields,
				accesses: model.accesses
			});
		}

		// Get models to delete
		const toDelete = Object.keys(this.hashes).filter(
			id => !models.some(m => m.id === id)
		);

		// Delete models
		for (const id of toDelete) {
			await this.apiService.delete(`model/${id}`);
		}

		this.updateHashes(models);

		// Return updated models
		return models;
	}

	/** Update hashes from models */
	private updateHashes(models: IModel[]) {
		this.hashes = {};
		for (const model of models) {
			this.hashes[model.id] = ModelsApiStorageService.hash(model);
		}
	}

	/** Create a hash for the model */
	private static hash(model: IModel): string {
		return md5(JSON.stringify(new Model(model).toObject()));
	}
}
