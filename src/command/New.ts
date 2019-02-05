import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService } from '../service';
import { cPath } from './helpers';
import * as Inquirer from 'inquirer';
import { BoilerplatesCollection, PresetsCollection } from '../class';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);

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

		// Get project
		if (cmd.project) {
			qProject.id = cmd.project;
		} else if (cmd.projectName) {
			qProject.name = cmd.projectName;
			qProject.description = cmd.projectDescription;
		} else {
			const answer = await Inquirer.prompt([
				{
					name: 'name',
					message: 'Enter a project name',
					validate: input => input.length > 0
				},
				{
					name: 'description',
					message: 'Enter a project description'
				}
			]);
			qProject.name = answer.name;
			qProject.description = answer.description;
		}

		// Get boilerplate
		if (cmd.boilerplate) {
			qBoilerplate.slug = cmd.boilerplate;
		} else if (cmd.boilerplateId) {
			qBoilerplate.id = cmd.boilerplateId;
		} else if (cmd.boilerplateUrl) {
			qBoilerplate.url = cmd.boilerplateUrl;
		} else {
			// Get boilerplates from remote
			const boilerplates = (await (await BoilerplatesCollection.getInstance()).list()).map(
				b => ({ name: b.name, value: b.git_url })
			);

			qBoilerplate.url = (await Inquirer.prompt([
				{
					name: 'url',
					message: 'Choose a boilerplate',
					type: 'list',
					choices: [
						{ name: 'Enter URL', value: null },
						new Inquirer.Separator(),
						...boilerplates
					]
				},
				{
					name: 'url',
					message: 'Enter boilerplate URL',
					when: answer => !answer.url,
					validate: input => input.length > 0
				}
			])).url;
		}

		// Get presets
		if (cmd.preset && cmd.preset.length) {
			qPresets = cmd.preset;
		} else {
			// Get presets from remote
			const presets = (await (await PresetsCollection.getInstance()).list()).map(
				p => ({ name: p.name, value: p.id })
			);

			qPresets = (await Inquirer.prompt([
				{
					name: 'presets',
					message: 'Choose some preset to preload in your project',
					type: 'checkbox',
					choices: presets
				}
			])).presets;
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
