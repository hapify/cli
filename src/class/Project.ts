import { Container } from 'typedi';
import { ISerializable, IStorable, StorageType } from '../interface/Storage';
import { IProject } from '../interface/Objects';
import { ProjectsApiStorageService } from '../service/storage/api/Projects';
import { ProjectFileStorageService } from '../service/storage/file/Project';
import * as Joi from '@hapi/joi';
import { ProjectConfigSchema } from '../interface/schema/Config';
import { TransformValidationMessage } from '../interface/schema/ValidatorResult';
import { Channel } from './Channel';

export class Project implements IStorable, ISerializable<IProject, Project>, IProject {
	/** The project's unique id */
	private _id: string;
	get id(): string {
		return this._id;
	}
	set id(value: string) {
		// If the id is not a MongoDB Id, then it should be a file path
		if (Project.isMongoId(value)) {
			this._id = value;
			this._storageType = 'remote';
		} else {
			if (!this.localStorageService.exists(value)) {
				throw new Error(`Invalid path "${value}" for project`);
			}
			this._id = value;
			this._storageType = 'local';
		}
	}
	/** The project's creation date */
	created_at?: number;
	/** The project's name */
	name: string;
	/** The project's description */
	description?: string;
	/** Storage type */
	private _storageType: StorageType;
	get storageType(): StorageType {
		return this._storageType;
	}
	/** Project storage */
	private remoteStorageService: ProjectsApiStorageService;
	private localStorageService: ProjectFileStorageService;
	/** The loaded instances */
	private static instances: { [id: string]: Project } = {};

	public constructor(object?: IProject) {
		this.remoteStorageService = Container.get(ProjectsApiStorageService);
		this.localStorageService = Container.get(ProjectFileStorageService);
		if (object) {
			this.fromObject(object);
		}
	}

	/** Returns a singleton for this config */
	public static async getInstance(project: string) {
		if (!this.instances[project]) {
			this.instances[project] = new Project();
			this.instances[project].id = project;
			await this.instances[project].load();
		}
		return this.instances[project];
	}

	public fromObject(object: IProject): Project {
		this.id = object.id;
		this.created_at = object.created_at;
		this.name = object.name;
		this.description = object.description;
		return this;
	}

	public toObject(): IProject {
		return {
			id: this._id,
			created_at: this.created_at,
			name: this.name,
			description: this.description,
		};
	}

	public async load(): Promise<void> {
		if (this.storageType === 'local') {
			// Validate config format
			const projectConfig = await this.localStorageService.get(this._id);
			const validation = Joi.validate(projectConfig, ProjectConfigSchema);
			if (validation.error) {
				// Transform Joi message
				TransformValidationMessage(validation.error);
				throw validation.error;
			}

			this.fromObject(await this.localStorageService.getProject(this._id));
		} else {
			this.fromObject(await this.remoteStorageService.get(this._id));
		}
	}
	async save(): Promise<void> {
		// Nothing to save
	}

	static async createLocalForChannel(channel: Channel): Promise<void> {
		await Container.get(ProjectFileStorageService).setProject(
			channel.guessProjectIdOrPath(),
			{
				id: channel.config.project,
				name: 'My project',
				description: 'A new Hapify project',
			},
			[]
		);
	}

	static isMongoId(value: string): boolean {
		const regex = /^([a-f0-9]{24})$/i;
		return regex.exec(value) !== null;
	}
}
