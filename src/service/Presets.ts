import { Service } from 'typedi';
import { PresetsCollection, Model, Field } from '../class';
import { ChannelsService } from './Channels';
import { InfoService } from './Info';

export interface PresetMergeResults {
	created: Model[];
	updated: Model[];
}

@Service()
export class PresetsService {
	/**
	 * Constructor
	 */
	constructor(
		private channelsService: ChannelsService,
		private infoService: InfoService
	) {}

	/**
	 * Returns the presets collection
	 * @return {PresetsCollection}
	 * @throws {Error}
	 */
	async collection(): Promise<PresetsCollection> {
		return await PresetsCollection.getInstance();
	}

	/**
	 * Apply one preset to models
	 */
	async apply(presetModels: Model[]): Promise<PresetMergeResults> {
		// Add or update each models
		const updated: Model[] = [];
		const created: Model[] = [];

		// List
		const modelsCollection = await this.channelsService.modelsCollection();
		const models = await modelsCollection.list();

		for (const model of presetModels) {
			const existing = models.find(m => m.name === model.name);
			if (existing) {
				// Add or skip each fields
				const clone = existing.clone();
				let edited = false;
				for (const field of model.fields) {
					if (!clone.fields.some(f => f.name === field.name)) {
						clone.fields.push(field);
						edited = true;
					}
				}
				if (edited) {
					updated.push(clone);
				}
			} else {
				const clone = model.clone();
				const defaultFields = (await this.infoService.fields()).map(
					f => {
						const field = new Field();
						field.fromObject(f);
						return field;
					}
				);
				clone.fields = defaultFields.concat(clone.fields);
				created.push(clone);
			}
		}

		// Return results
		return {
			updated,
			created
		};
	}
}
