import { Container } from 'typedi';
import { Command } from 'commander';
import {
	OptionsService,
	LoggerService,
	PresetsService,
	BoilerplatesService,
	ProjectsService
} from '../service';
import { cPath } from './helpers';
import * as Inquirer from 'inquirer';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const presets = Container.get(PresetsService);
const boilerplates = Container.get(BoilerplatesService);
const projects = Container.get(ProjectsService);

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
interface Query {
	project: ProjectQuery;
	boilerplate: BoilerplateQuery;
	presets: string[];
}

export async function NewCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		const qProject: ProjectQuery = {};
		const qBoilerplate: BoilerplateQuery = {};
		let qPresets: string[] = [];

		// ---------------------------------
		// Action starts

		// =================================
		// Get project
		if (cmd.project) {
			qProject.id = cmd.project;
		} else if (cmd.projectName) {
			qProject.name = cmd.projectName;
			qProject.description = cmd.projectDescription;
		} else {
			// Get projects from remote
			const list = (await (await projects.collection()).list()).map(
				b => ({ name: b.name, value: b.id })
			);
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
			const list = (await (await boilerplates.collection()).list()).map(
				b => ({ name: b.name, value: b.git_url })
			);

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
			const list = (await (await presets.collection()).list()).map(p => ({
				name: p.name,
				value: p.id
			}));

			qPresets = ((await Inquirer.prompt([
				{
					name: 'presets',
					message: 'Choose some preset to preload in your project',
					type: 'checkbox',
					choices: list,
					when: () => list.length > 0
				}
			])) as any).presets;
		}

		const query: Query = {
			project: qProject,
			boilerplate: qBoilerplate,
			presets: qPresets
		};

		logger.info(JSON.stringify(query, null, 4));

		logger.success(
			`Created a new dynamic boilerplate in ${cPath(options.dir())}`
		);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
