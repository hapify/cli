import { Command } from 'commander';
import * as Inquirer from 'inquirer';
import { Container } from 'typedi';
import { BoilerplatesService } from '../../service';

export interface BoilerplateQuery {
	id?: string;
	slug?: string;
	url?: string;
}
export async function AskBoilerplate(
	cmd: Command,
	qBoilerplate: BoilerplateQuery
) {
	const boilerplatesCollection = await Container.get(
		BoilerplatesService
	).collection();

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

	if (!qBoilerplate.id && !qBoilerplate.slug && !qBoilerplate.url) {
		throw new Error('No boilerplate is defined');
	}
}
export async function FindBoilerplate(qBoilerplate: BoilerplateQuery) {
	const boilerplatesCollection = await Container.get(
		BoilerplatesService
	).collection();

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
}
