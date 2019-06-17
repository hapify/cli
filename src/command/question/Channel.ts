import { Command } from 'commander';
import * as Inquirer from 'inquirer';

export interface ChannelDescriptionQuery {
	name?: string;
	description?: string;
	logo?: string;
}
export async function DescribeChannel(
	cmd: Command,
	qChannelDescription: ChannelDescriptionQuery
) {
	// Get description from user
	// If the name is passed, bypass all questions
	const answer = (await Inquirer.prompt([
		{
			name: 'name',
			message: 'Enter the boilerplate name',
			when: () => !cmd.boilerplateName,
			default: null
		},
		{
			name: 'description',
			message: 'Enter a description',
			when: () => !cmd.boilerplateDesc && !cmd.boilerplateName,
			default: null
		},
		{
			name: 'logo',
			message: 'Enter a logo URL',
			when: () => !cmd.boilerplateLogo && !cmd.boilerplateName,
			default: null
		}
	])) as any;

	qChannelDescription.name = cmd.boilerplateName || answer.name;
	qChannelDescription.description = cmd.boilerplateDesc || answer.description;
	qChannelDescription.logo = cmd.boilerplateLogo || answer.logo;
}
