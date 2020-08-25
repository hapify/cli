import { Service } from 'typedi';
import { SingleSaveFileStorage } from './SingleSave';
import { CompactFieldBooleanProperty, IStorableCompactProject, IStorableProject } from '../../../interface/Storage';
import { IProject } from '../../../interface/Objects';
import * as Path from 'path';
import { IModel } from '../../../interface/Generator';

@Service()
export class ProjectFileStorageService extends SingleSaveFileStorage<IStorableProject> {
	private booleanPropertiesNames: CompactFieldBooleanProperty[] = [
		'primary',
		'unique',
		'label',
		'nullable',
		'multiple',
		'embedded',
		'searchable',
		'sortable',
		'hidden',
		'internal',
		'restricted',
		'ownership',
	];
	protected async serialize(content: IStorableProject): Promise<string> {
		const compact: IStorableCompactProject = {
			version: content.version,
			name: content.name || undefined,
			description: content.description || undefined,
			models: content.models.map((model) => {
				return {
					id: model.id,
					name: model.name,
					accesses: model.accesses,
					fields: model.fields.map((field) => {
						return {
							name: field.name,
							type: field.type,
							subtype: field.subtype || undefined,
							reference: field.reference || undefined,
							properties: this.booleanPropertiesNames
								.map((property) => {
									return field[property] ? property : null;
								})
								.filter((p) => !!p),
							notes: field.notes || undefined,
						};
					}),
					notes: model.notes || undefined,
				};
			}),
		};
		return JSON.stringify(compact, null, 2);
	}
	protected async deserialize(content: string): Promise<IStorableProject> {
		try {
			const compact: IStorableCompactProject = JSON.parse(content);
			return {
				version: compact.version,
				name: compact.name || null,
				description: compact.description || null,
				models: compact.models.map((model) => {
					return {
						id: model.id,
						name: model.name,
						accesses: model.accesses,
						fields: model.fields.map((field) => {
							return {
								name: field.name,
								type: field.type,
								subtype: field.subtype || null,
								reference: field.reference || null,
								primary: field.properties.includes('primary'),
								unique: field.properties.includes('unique'),
								label: field.properties.includes('label'),
								nullable: field.properties.includes('nullable'),
								multiple: field.properties.includes('multiple'),
								embedded: field.properties.includes('embedded'),
								searchable: field.properties.includes('searchable'),
								sortable: field.properties.includes('sortable'),
								hidden: field.properties.includes('hidden'),
								internal: field.properties.includes('internal'),
								restricted: field.properties.includes('restricted'),
								ownership: field.properties.includes('ownership'),
								notes: field.notes || null,
							};
						}),
						notes: model.notes || null,
					};
				}),
			};
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

	async getModels(path: string): Promise<IModel[]> {
		const project = await this.get(path);
		return project.models;
	}
	async setModels(path: string, models: IModel[]): Promise<void> {
		const project = await this.get(path);
		project.models = models;
		await this.set(path, project);
	}
}
