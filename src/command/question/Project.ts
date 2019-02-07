import { Command } from 'commander';
import * as Inquirer from 'inquirer';
import { Container } from 'typedi';
import { ProjectsService } from '../../service';

export interface ProjectQuery {
	id?: string;
	name?: string;
	description?: string;
}
export async function AskProject(cmd: Command, qProject: ProjectQuery) {
	const projectsCollection = await Container.get(
		ProjectsService
	).collection();

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

	if (!qProject.id && !qProject.name) {
		throw new Error('No project is defined');
	}
}
export async function SetupProject(qProject: ProjectQuery) {
	const projectsCollection = await Container.get(
		ProjectsService
	).collection();

	if (!qProject.id) {
		const project = await projectsCollection.add(
			qProject.name,
			qProject.description
		);
		qProject.id = project.id;
	}
}
