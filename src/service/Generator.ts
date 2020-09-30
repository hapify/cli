import { Service } from 'typedi';
import { ApiService } from './Api';
import { ILimits } from '../interface/Config';
import { Channel } from '../class/Channel';
import { IGeneratorResult } from '../interface/Generator';
import { Template } from '../class/Template';
import { Model } from '../class/Model';
import { Generator } from 'hapify-generator';

@Service()
export class GeneratorService {
	/** Stores the limits */
	private _limits: ILimits;

	constructor(private apiService: ApiService) {}

	/** Get the limits once and returns them */
	async limits(): Promise<ILimits> {
		if (!this._limits) {
			this._limits = (await this.apiService.get<ILimits>('generator/limits')).data;
		}
		return this._limits;
	}

	/** Compile for a whole channel */
	async runChannel(channel: Channel): Promise<IGeneratorResult[]> {
		const models = await channel.modelsCollection.list();
		return await Generator.run(channel.templates, models);
	}

	/**
	 * Compile a template to multiple files.
	 * One per model, if applicable.
	 *
	 */
	async runTemplate(template: Template): Promise<IGeneratorResult[]> {
		const models = await template.channel().modelsCollection.list();
		return await Generator.run([template], models);
	}

	/**
	 * Run generation process for one template/model
	 * @throws {Error} If the template needs a model and no model is passed
	 */
	async run(template: Template, model: Model | null): Promise<IGeneratorResult> {
		if (template.needsModel() && !model) {
			throw new Error('Model should be defined for this template');
		}

		const models = await template.channel().modelsCollection.list();
		const result = await Generator.run([template], models, model ? [model.id] : null);
		return result[0];
	}

	/** Compute path from a string */
	async pathPreview(path: string, model: Model | null = null): Promise<string> {
		return Generator.path(path, model ? model.name : null);
	}
}
