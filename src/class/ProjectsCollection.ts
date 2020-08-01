import { Container } from 'typedi';
import { IStorable } from '../interface/IStorable';
import { ISerializable } from '../interface/ISerializable';
import { IProject } from '../interface/IObjects';
import { Project } from './Project';
import { ProjectsApiStorageService } from '../service/storage/api/Projects';

export class ProjectsCollection implements IStorable, ISerializable<IProject[], Project[]> {
	/** @type {Project[]} The list of project instances */
	private projects: Project[] = [];
	/** Projects storage */
	private storageService: ProjectsApiStorageService;
	/** @type {string} The loaded instance */
	private static instance: ProjectsCollection;

	/** Constructor */
	private constructor() {
		this.storageService = Container.get(ProjectsApiStorageService);
	}

	/** Returns a singleton for this config */
	public static async getInstance() {
		if (!ProjectsCollection.instance) {
			// Create and load a new collection
			ProjectsCollection.instance = new ProjectsCollection();
			await ProjectsCollection.instance.load();
		}
		return ProjectsCollection.instance;
	}

	/**
	 * Load the projects
	 * @return {Promise<void>}
	 */
	async load(): Promise<void> {
		this.fromObject(await this.storageService.list());
	}

	/** @inheritDoc */
	async save(): Promise<void> {
		// Nothing to save
	}

	/**
	 * Returns the list of projects
	 * @returns {Promise<Project[]>}
	 */
	async list(): Promise<Project[]> {
		return this.projects;
	}

	/**
	 * Returns one project
	 * @returns {Promise<Project>}
	 */
	async get(id: string): Promise<Project> {
		return this.projects.find((p) => p.id === id);
	}

	/**
	 * Returns one project
	 * @returns {Promise<Project>}
	 */
	async add(name: string, description: string): Promise<Project> {
		const object = await this.storageService.create({
			name,
			description: description.length ? description : null,
		});
		return new Project(object);
	}

	/** @inheritDoc */
	public fromObject(object: IProject[]): Project[] {
		this.projects = object.map((p) => new Project(p));
		return this.projects;
	}

	/** @inheritDoc */
	public toObject(): IProject[] {
		return this.projects.map((p) => p.toObject());
	}
}
