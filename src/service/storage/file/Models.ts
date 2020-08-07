import { Service } from 'typedi';
import { SingleSaveFileStorage } from './SingleSave';
import { IProjectConfig } from '../../../interface/Config';
import { IModel } from '../../../interface/Generator';

@Service()
export class ModelsFileStorageService extends SingleSaveFileStorage<IProjectConfig> {
	protected async serialize(content: IProjectConfig): Promise<string> {
		return JSON.stringify(content, null, 2);
	}
	protected async deserialize(content: string): Promise<IProjectConfig> {
		try {
			return JSON.parse(content);
		} catch (error) {
			throw new Error(`An error occurred while parsing Project configuration: ${error.toString()}`);
		}
	}

	async forProject(path: string): Promise<IModel[]> {
		const project = await this.get(path);
		return project.models;
	}
	async setModels(path: string, models: IModel[]): Promise<void> {
		const project = await this.get(path);
		project.models = models;
		await this.set(path, project);
	}
}
