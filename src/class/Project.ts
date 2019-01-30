import { IProject, ISerializable, IStorable } from '../interface';
import { ProjectApiStorageService } from '../service';
import { Channel } from './';
import { Container } from 'typedi';

export class Project
	implements IStorable, ISerializable<IProject, Project>, IProject {
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
	private storageService: ProjectApiStorageService;

	/** Constructor */
	constructor(private parent: Channel, object?: IProject) {
		this.storageService = Container.get(ProjectApiStorageService);
		if (object) {
			this.fromObject(object);
		}
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
			description: this.description
		};
	}

	/** @inheritDoc */
	public async load(): Promise<void> {
		this.fromObject(
			await this.storageService.get(this.parent.config.project)
		);
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		// Nothing to save
	}
}
