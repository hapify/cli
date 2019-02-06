import { Container } from 'typedi';
import { Command } from 'commander';
import {
	OptionsService,
	LoggerService,
	PresetsService,
	BoilerplatesService,
	ProjectsService,
	ChannelsService
} from '../service';
import { cPath } from './helpers';
import * as Inquirer from 'inquirer';
import * as Fs from 'fs';
import { Channel } from '../class';

const SimpleGit = require('simple-git/promise');

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const presets = Container.get(PresetsService);
const boilerplates = Container.get(BoilerplatesService);
const projects = Container.get(ProjectsService);
const channels = Container.get(ChannelsService);

interface ProjectQuery {
	id?: string;
	name?: string;
	description?: string;
}
interface BoilerplateQuery {
	id?: string;
	slug?: string;
	url?: string;
}

export async function NewCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		const qProject: ProjectQuery = {};
		const qBoilerplate: BoilerplateQuery = {};
		let qPresets: string[] = [];

		// ---------------------------------
		// Verify current dir
		const currentDir = options.dir();
		const files = Fs.readdirSync(currentDir);
		if (files.length) {
			throw new Error(
				'Current folder is not empty, cannot create a new project.'
			);
		}

		// ---------------------------------
		// Action starts
		const projectsCollection = await projects.collection();
		const boilerplatesCollection = await boilerplates.collection();
		const presetsCollection = await presets.collection();

		// =================================
		// Get project
		if (cmd.project) {
			qProject.id = cmd.project;
		} else if (cmd.projectName) {
			qProject.name = cmd.projectName;
			qProject.description = cmd.projectDescription;
		} else {
			// Get projects from remote
			const list = (await projectsCollection.list()).map(b => ({
				name: b.name,
				value: b.id
			}));
			const answer: any = await Inquirer.prompt([
				{
					name: 'id',
					message: 'Choose a project',
					type: 'list',
					choices: [
						{ name: 'Create a new project', value: null },
						new Inquirer.Separator(),
						...list
					],
					when: () => list.length > 0
				},
				{
					name: 'name',
					message: 'Enter a project name',
					when: (answer: any) => !answer.id,
					validate: input => input.length > 0
				},
				{
					name: 'description',
					message: 'Enter a project description',
					when: (answer: any) => !answer.id
				}
			]);
			qProject.id = answer.id;
			qProject.name = answer.name;
			qProject.description = answer.description;
		}

		// =================================
		// Get boilerplate
		if (cmd.boilerplate) {
			qBoilerplate.slug = cmd.boilerplate;
		} else if (cmd.boilerplateId) {
			qBoilerplate.id = cmd.boilerplateId;
		} else if (cmd.boilerplateUrl) {
			qBoilerplate.url = cmd.boilerplateUrl;
		} else {
			// Get boilerplates from remote
			const list = (await boilerplatesCollection.list()).map(b => ({
				name: b.name,
				value: b.git_url
			}));

			qBoilerplate.url = ((await Inquirer.prompt([
				{
					name: 'url',
					message: 'Choose a boilerplate',
					type: 'list',
					choices: [
						{ name: 'Enter a Git URL', value: null },
						new Inquirer.Separator(),
						...list
					],
					when: () => list.length > 0
				},
				{
					name: 'url',
					message: 'Enter boilerplate URL',
					when: (answer: any) => !answer.url,
					validate: input => input.length > 0
				}
			])) as any).url;
		}

		// =================================
		// Get presets
		if (cmd.preset && cmd.preset.length) {
			qPresets = cmd.preset;
		} else {
			// Get presets from remote
			const list = (await presetsCollection.list()).map(p => ({
				name: p.name,
				value: p.id
			}));

			qPresets = ((await Inquirer.prompt([
				{
					name: 'presets',
					message: 'Choose some presets to preload in your project',
					type: 'checkbox',
					choices: list,
					when: () => list.length > 0
				}
			])) as any).presets;
		}

		// =================================
		// Check validity
		if (!qProject.id && !qProject.name) {
			throw new Error('No project is defined');
		}
		if (!qBoilerplate.id && !qBoilerplate.slug && !qBoilerplate.url) {
			throw new Error('No boilerplate is defined');
		}

		// =================================
		// Create project if necessary
		if (!qProject.id) {
			const project = await projectsCollection.add(
				qProject.name,
				qProject.description
			);
			qProject.id = project.id;
		}

		// =================================
		// Get boilerplate URL
		if (!qBoilerplate.url) {
			let boilerplate;
			if (qBoilerplate.slug) {
				boilerplate = await boilerplatesCollection.getBySlug(
					qBoilerplate.slug
				);
			} else if (qBoilerplate.id) {
				boilerplate = await boilerplatesCollection.get(qBoilerplate.id);
			}
			if (!boilerplate) {
				throw new Error('Boilerplate not found');
			}
			qBoilerplate.url = boilerplate.git_url;
		}

		// =================================
		// Clone git repo
		const git = SimpleGit(currentDir);
		await git.clone(qBoilerplate.url, currentDir);

		// =================================
		// Init & validate channel for this new folder
		await Channel.changeProject(currentDir, qProject.id);
		const modelsCollection = await channels.modelsCollection();

		// =================================
		// Get models and apply presets if necessary
		if (qPresets && qPresets.length) {
			const models = await modelsCollection.list();
			// If the project already has models, ignore add presets
			if (models.length) {
				logger.warning(
					'Project already contains models. Ignore presets import.'
				);
			} else {
				// Get and apply presets
				for (const id of qPresets) {
					const preset = await presetsCollection.get(id);
					const results = await presets.apply(preset.models);
					await modelsCollection.add(results.created);
					await modelsCollection.update(results.updated);
				}
				// Save models
				await modelsCollection.save();
			}
		}

		logger.success(
			`Created a new dynamic boilerplate in ${cPath(
				currentDir
			)}. Run 'hpf serve' to edit.`
		);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
