import { Service } from 'typedi';
import { SingleSaveFileStorage } from './SingleSave';
import { IProjectConfig } from '../../../interface/Config';
import { IProject } from '../../../interface/Objects';
import * as Path from 'path';

@Service()
export class ProjectFileStorageService extends SingleSaveFileStorage<IProjectConfig> {
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

	async getProject(path: string): Promise<IProject> {
		const projectConfig = await this.get(path);
		return {
			id: path,
			created_at: Date.now(), // Placeholder
			description: projectConfig.description,
			name: projectConfig.name || Path.basename(Path.dirname(path)),
		};
	}
}
