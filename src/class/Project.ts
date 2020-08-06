import { Container } from 'typedi';
import { ISerializable, IStorable } from '../interface/Storage';
import { IProject } from '../interface/Objects';
import { ProjectsApiStorageService } from '../service/storage/api/Projects';

export class Project implements IStorable, ISerializable<IProject, Project>, IProject {
	/** The project's unique id */
	id: string;
	/** The project's unique id */
	created_at: number;
	/** The project's name */
	name: string;
	/** The project's description */
	description: string;
	/** The project's owner payload */
	owner: string | any;
	/** Project storage */
	private storageService: ProjectsApiStorageService;
	/** The loaded instances */
	private static instances: { [id: string]: Project } = {};

	/** Constructor */
	constructor(object?: IProject) {
		if (object) {
			this.fromObject(object);
		}
		this.storageService = Container.get(ProjectsApiStorageService);
	}

	/**
	 * Returns a singleton for this config
	 * @param {string} project
	 */
	public static async getInstance(project: string) {
		if (!this.instances[project]) {
			this.instances[project] = new Project();
			this.instances[project].id = project;
			await this.instances[project].load();
		}
		return this.instances[project];
	}

	/** @inheritDoc */
	public fromObject(object: IProject): Project {
		this.id = object.id;
		this.created_at = object.created_at;
		this.name = object.name;
		this.description = object.description;
		return this;
	}

	/** @inheritDoc */
	public toObject(): IProject {
		return {
			id: this.id,
			created_at: this.created_at,
			name: this.name,
			description: this.description,
		};
	}

	/** @inheritDoc */
	public async load(): Promise<void> {
		this.fromObject(await this.storageService.get(this.id));
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		// Nothing to save
	}
}
