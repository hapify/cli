import { Channel } from '../class';
import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService, LoggerService, ProjectsService } from '../service';
import { cPath } from './helpers';
import * as Inquirer from 'inquirer';

// ############################################
// Get services
const options = Container.get(OptionsService);
const logger = Container.get(LoggerService);
const projects = Container.get(ProjectsService);

interface ProjectQuery {
	id?: string;
	name?: string;
	description?: string;
}

export async function InitCommand(cmd: Command) {
	try {
		options.setCommand(cmd);

		const qProject: ProjectQuery = {};

		// ---------------------------------
		// Action starts
		const projectsCollection = await projects.collection();

		// =================================
		// Init channel to save
		const channel = await Channel.create(options.dir());

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
		// Create project if necessary
		if (!qProject.id) {
			const project = await projectsCollection.add(
				qProject.name,
				qProject.description
			);
			qProject.id = project.id;
		}

		// =================================
		// Set project in channel and save
		channel.config.project = qProject.id;
		await channel.save();

		logger.success(
			`Initialized a dynamic boilerplate in ${cPath(options.dir())}`
		);
		// Action Ends
		// ---------------------------------

		logger.time();
	} catch (error) {
		logger.handle(error);
	}
}
